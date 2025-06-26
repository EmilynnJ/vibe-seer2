// Production API service for SoulSeer Admin Dashboard
// This service handles all database operations through REST API endpoints

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.soulseer.app';

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await this.getAuthToken()}`,
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async getAuthToken(): Promise<string> {
    // In production, this would retrieve the auth token from secure storage
    return 'your-auth-token';
  }

  // Admin Authentication
  async adminLogin(email: string, password: string) {
    return this.makeRequest('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Platform Statistics
  async getPlatformStats() {
    return this.makeRequest('/admin/stats');
  }

  // Reader Management
  async getAllReaders() {
    return this.makeRequest('/admin/readers');
  }

  async createReader(readerData: any) {
    return this.makeRequest('/admin/readers', {
      method: 'POST',
      body: JSON.stringify(readerData),
    });
  }

  async updateReader(userId: string, updates: any) {
    return this.makeRequest(`/admin/readers/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deactivateUser(userId: string) {
    return this.makeRequest(`/admin/users/${userId}/deactivate`, {
      method: 'POST',
    });
  }

  // Client Management
  async getAllClients() {
    return this.makeRequest('/admin/clients');
  }

  async refundClient(userId: string, amount: number, reason: string) {
    return this.makeRequest(`/admin/clients/${userId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    });
  }

  // Session Management
  async getActiveSessions() {
    return this.makeRequest('/admin/sessions/active');
  }

  async createSession(sessionData: any) {
    return this.makeRequest('/admin/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async endSession(sessionId: string, totalMinutes: number, totalCost: number) {
    return this.makeRequest(`/admin/sessions/${sessionId}/end`, {
      method: 'POST',
      body: JSON.stringify({ totalMinutes, totalCost }),
    });
  }

  // User Management
  async createUser(userData: any) {
    return this.makeRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserByEmail(email: string) {
    return this.makeRequest(`/admin/users/email/${encodeURIComponent(email)}`);
  }

  async getUserById(id: string) {
    return this.makeRequest(`/admin/users/${id}`);
  }

  // Stripe Integration
  async createStripeAccount(readerId: string) {
    return this.makeRequest(`/admin/stripe/accounts`, {
      method: 'POST',
      body: JSON.stringify({ readerId }),
    });
  }

  async processPayment(paymentData: any) {
    return this.makeRequest('/admin/stripe/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getStripeBalance() {
    return this.makeRequest('/admin/stripe/balance');
  }

  // Analytics
  async getRevenueAnalytics(period: string = '30d') {
    return this.makeRequest(`/admin/analytics/revenue?period=${period}`);
  }

  async getUserAnalytics(period: string = '30d') {
    return this.makeRequest(`/admin/analytics/users?period=${period}`);
  }

  async getSessionAnalytics(period: string = '30d') {
    return this.makeRequest(`/admin/analytics/sessions?period=${period}`);
  }
}

export default new ApiService();