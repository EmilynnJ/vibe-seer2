import DatabaseService from '../services/database';
const bcrypt = require('bcryptjs');

export async function initializeDatabase() {
  try {
    await DatabaseService.initializeSchema();




    // Check if admin already exists
    const existingAdmin = await DatabaseService.getUserByEmail('admin@soulseer.com');
    
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123!', 12);
      
      await DatabaseService.createUser({
        email: 'admin@soulseer.com',
        passwordHash,
        firstName: 'SoulSeer',
        lastName: 'Admin',
        role: 'admin'
      });
      
          } else {
          }
      
      
      
      

    // Create some default settings
    await DatabaseService.query(`
      INSERT INTO admin_settings (key, value, description) 
      VALUES 
        ('platform_commission', '{"rate": 0.30}', 'Platform commission rate (30%)'),
        ('min_payout_threshold', '{"amount": 15.00}', 'Minimum payout threshold'),
        ('max_session_duration', '{"minutes": 180}', 'Maximum session duration in minutes')
      ON CONFLICT (key) DO NOTHING
    `);
    
      return true;
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}