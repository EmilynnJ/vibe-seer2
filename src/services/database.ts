import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export class DatabaseService {
  static async query(text: string, params?: any[]) {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async initializeSchema() {
    try {
      // Users table
      await this.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'reader', 'admin')),
          avatar_url TEXT,
          is_verified BOOLEAN DEFAULT false,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Client profiles
      await this.query(`
        CREATE TABLE IF NOT EXISTS client_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          balance DECIMAL(10,2) DEFAULT 0.00,
          total_spent DECIMAL(10,2) DEFAULT 0.00,
          stripe_customer_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Reader profiles
      await this.query(`
        CREATE TABLE IF NOT EXISTS reader_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          bio TEXT,
          specialties JSONB DEFAULT '[]',
          chat_rate DECIMAL(5,2) DEFAULT 0.00,
          phone_rate DECIMAL(5,2) DEFAULT 0.00,
          video_rate DECIMAL(5,2) DEFAULT 0.00,
          is_available BOOLEAN DEFAULT false,
          is_online BOOLEAN DEFAULT false,
          total_earnings DECIMAL(10,2) DEFAULT 0.00,
          pending_earnings DECIMAL(10,2) DEFAULT 0.00,
          rating DECIMAL(3,2) DEFAULT 0.00,
          total_reviews INTEGER DEFAULT 0,
          stripe_account_id VARCHAR(255),
          verification_status VARCHAR(20) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Reading sessions
      await this.query(`
        CREATE TABLE IF NOT EXISTS reading_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          reader_id UUID REFERENCES users(id),
          client_id UUID REFERENCES users(id),
          session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('chat', 'phone', 'video')),
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'ended', 'cancelled')),
          rate_per_minute DECIMAL(5,2) NOT NULL,
          start_time TIMESTAMP,
          end_time TIMESTAMP,
          total_minutes INTEGER DEFAULT 0,
          total_cost DECIMAL(10,2) DEFAULT 0.00,
          stripe_payment_intent_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Session messages
      await this.query(`
        CREATE TABLE IF NOT EXISTS session_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id UUID REFERENCES reading_sessions(id) ON DELETE CASCADE,
          sender_id UUID REFERENCES users(id),
          sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('client', 'reader')),
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Transactions
      await this.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'session_payment', 'refund')),
          amount DECIMAL(10,2) NOT NULL,
          description TEXT,
          stripe_transaction_id VARCHAR(255),
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Reviews
      await this.query(`
        CREATE TABLE IF NOT EXISTS reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id UUID REFERENCES reading_sessions(id),
          client_id UUID REFERENCES users(id),
          reader_id UUID REFERENCES users(id),
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          review_text TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Admin settings
      await this.query(`
        CREATE TABLE IF NOT EXISTS admin_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          key VARCHAR(100) UNIQUE NOT NULL,
          value JSONB NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Error initializing database schema:', error);
      throw error;
    }
  }

  // User management
  static async createUser(userData: any) {
    const { email, passwordHash, firstName, lastName, role } = userData;
    const result = await this.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, passwordHash, firstName, lastName, role]
    );
    return result.rows[0];
  }

  static async getUserByEmail(email: string) {
    const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async getUserById(id: string) {
    const result = await this.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Reader management
  static async createReaderProfile(userId: string, profileData: any) {
    const { bio, specialties, chatRate, phoneRate, videoRate } = profileData;
    const result = await this.query(
      `INSERT INTO reader_profiles 
       (user_id, bio, specialties, chat_rate, phone_rate, video_rate) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, bio, JSON.stringify(specialties), chatRate, phoneRate, videoRate]
    );
    return result.rows[0];
  }

  static async getAllReaders() {
    const result = await this.query(`
      SELECT u.*, rp.* FROM users u
      JOIN reader_profiles rp ON u.id = rp.user_id
      WHERE u.role = 'reader' AND u.is_active = true
      ORDER BY u.created_at DESC
    `);
    return result.rows;
  }

  static async updateReaderProfile(userId: string, updates: any) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const result = await this.query(
      `UPDATE reader_profiles SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 RETURNING *`,
      [userId, ...values]
    );
    return result.rows[0];
  }

  // Client management
  static async createClientProfile(userId: string) {
    const result = await this.query(
      'INSERT INTO client_profiles (user_id) VALUES ($1) RETURNING *',
      [userId]
    );
    return result.rows[0];
  }

  static async getAllClients() {
    const result = await this.query(`
      SELECT u.*, cp.* FROM users u
      JOIN client_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'client' AND u.is_active = true
      ORDER BY u.created_at DESC
    `);
    return result.rows;
  }

  static async updateClientBalance(userId: string, amount: number) {
    const result = await this.query(
      'UPDATE client_profiles SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
      [amount, userId]
    );
    return result.rows[0];
  }

  // Analytics
  static async getPlatformStats() {
    const [userStats, sessionStats, revenueStats] = await Promise.all([
      this.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE role = 'client') as total_clients,
          COUNT(*) FILTER (WHERE role = 'reader') as total_readers,
          COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_30d
        FROM users WHERE is_active = true
      `),
      this.query(`
        SELECT 
          COUNT(*) as total_sessions,
          COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
          COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as sessions_today,
          AVG(total_minutes) as avg_session_length
        FROM reading_sessions
      `),
      this.query(`
        SELECT 
          COALESCE(SUM(amount), 0) as total_revenue,
          COALESCE(SUM(amount) FILTER (WHERE created_at >= CURRENT_DATE), 0) as revenue_today,
          COALESCE(SUM(amount) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'), 0) as revenue_30d
        FROM transactions WHERE type = 'session_payment' AND status = 'completed'
      `)
    ]);

    return {
      users: userStats.rows[0],
      sessions: sessionStats.rows[0],
      revenue: revenueStats.rows[0]
    };
  }

  // Session management
  static async createSession(sessionData: any) {
    const { readerId, clientId, sessionType, ratePerMinute } = sessionData;
    const result = await this.query(
      `INSERT INTO reading_sessions (reader_id, client_id, session_type, rate_per_minute) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [readerId, clientId, sessionType, ratePerMinute]
    );
    return result.rows[0];
  }

  static async getActiveSessions() {
    const result = await this.query(`
      SELECT rs.*, 
             ru.first_name as reader_first_name, ru.last_name as reader_last_name,
             cu.first_name as client_first_name, cu.last_name as client_last_name
      FROM reading_sessions rs
      JOIN users ru ON rs.reader_id = ru.id
      JOIN users cu ON rs.client_id = cu.id
      WHERE rs.status = 'active'
      ORDER BY rs.start_time DESC
    `);
    return result.rows;
  }

  static async endSession(sessionId: string, totalMinutes: number, totalCost: number) {
    const result = await this.query(
      `UPDATE reading_sessions 
       SET status = 'ended', end_time = CURRENT_TIMESTAMP, total_minutes = $1, total_cost = $2
       WHERE id = $3 RETURNING *`,
      [totalMinutes, totalCost, sessionId]
    );
    return result.rows[0];
  }
}

export default DatabaseService;