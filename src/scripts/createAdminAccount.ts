import ApiService from '../services/apiService';

export async function createAdminAccount() {
  try {


    // In production, this would create the admin account in the database
    const adminData = {
      email: 'emilynnj14@gmail.com',
      password: 'JayJas1423!',
      firstName: 'Emilynn',
      lastName: 'Johnson',
      role: 'admin'
    };

    // Production would use: await ApiService.createUser(adminData)
    await ApiService.createUser(adminData)





    // Create admin settings
    const adminSettings = {
      platform_commission: { rate: 0.30 },
      min_payout_threshold: { amount: 15.00 },
      max_session_duration: { minutes: 180 },
      email_notifications: { enabled: true },
      sms_alerts: { enabled: true },
      webhook_endpoints: { 
        stripe: 'https://api.soulseer.app/webhooks/stripe',
        notifications: 'https://api.soulseer.app/webhooks/notifications'
      }
    };
    
    
    
    
    return {
      success: true,
      admin: adminData,
      settings: adminSettings
    };
  } catch (error) {
    console.error('❌ Admin account creation failed:', error);
    throw error;
  }
}

// Database schema for admin account (for production database)
export const ADMIN_ACCOUNT_SQL = `
-- Create admin user account
INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified, is_active) 
VALUES (
  'emilynnj14@gmail.com',
  '$2a$12$hash_for_JayJas1423!',
  'Emilynn',
  'Johnson',
  'admin',
  true,
  true
) ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  is_active = true,
  updated_at = CURRENT_TIMESTAMP;

-- Insert admin settings
INSERT INTO admin_settings (key, value, description) VALUES
  ('platform_commission', '{"rate": 0.30}', 'Platform commission rate (30%)'),
  ('min_payout_threshold', '{"amount": 15.00}', 'Minimum payout threshold for readers'),
  ('max_session_duration', '{"minutes": 180}', 'Maximum session duration in minutes'),
  ('email_notifications', '{"enabled": true}', 'Enable email notifications'),
  ('sms_alerts', '{"enabled": true}', 'Enable SMS alerts for critical events'),
  ('webhook_endpoints', '{"stripe": "https://api.soulseer.app/webhooks/stripe", "notifications": "https://api.soulseer.app/webhooks/notifications"}', 'Webhook endpoints configuration')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = CURRENT_TIMESTAMP;
`;

export default createAdminAccount;