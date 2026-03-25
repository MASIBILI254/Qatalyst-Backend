-- Insert sample organizations
INSERT INTO organizations (id, name, slug, tier, status) VALUES
  ('org_qatalyst', 'Qatalyst TechLabs', 'qatalyst', 'enterprise', 'active'),
  ('org_firstbank', 'First Bank Nigeria', 'firstbank', 'professional', 'active');

-- Insert sample users
INSERT INTO users (id, email, name, password_hash, role, organization_id, organization_name) VALUES
  ('usr_super_001', 'super@qatalyst.io', 'Super Administrator', '$2a$10$YWxU0j8j8j8j8j8j8j8j.example', 'super_admin', 'org_qatalyst', 'Qatalyst TechLabs'),
  ('usr_org_001', 'admin@firstbank.ng', 'First Bank Admin', '$2a$10$YWxU0j8j8j8j8j8j8j8j.example', 'org_admin', 'org_firstbank', 'First Bank Nigeria'),
  ('usr_staff_001', 'staff@firstbank.ng', 'Adebayo Okonkwo', '$2a$10$YWxU0j8j8j8j8j8j8j8j.example', 'staff', 'org_firstbank', 'First Bank Nigeria');

-- Insert sample branches
INSERT INTO branches (id, name, location, organization_id) VALUES
  ('br_vi_001', 'Victoria Island', 'Lagos, Nigeria', 'org_firstbank'),
  ('br_lekki_001', 'Lekki', 'Lagos, Nigeria', 'org_firstbank'),
  ('br_ikeja_001', 'Ikeja', 'Lagos, Nigeria', 'org_firstbank');

-- Insert sample services
INSERT INTO services (id, name, description, organization_id, estimated_time) VALUES
  ('svc_001', 'Account Opening', 'New customer account opening', 'org_firstbank', 20),
  ('svc_002', 'Loan Services', 'Loan inquiry and application', 'org_firstbank', 30),
  ('svc_003', 'Card Services', 'Debit/Credit card services', 'org_firstbank', 15),
  ('svc_004', 'Customer Support', 'General customer support', 'org_firstbank', 10);

-- Insert sample devices
INSERT INTO devices (id, name, type, organization_id, branch_id, status, firmware_version) VALUES
  ('dev_001', 'Kiosk - VI Branch', 'kiosk', 'org_firstbank', 'br_vi_001', 'online', '2.1.0'),
  ('dev_002', 'Display - VI Branch', 'display', 'org_firstbank', 'br_vi_001', 'online', '1.5.0'),
  ('dev_003', 'Counter Terminal - VI', 'counter_terminal', 'org_firstbank', 'br_vi_001', 'online', '3.0.0');
