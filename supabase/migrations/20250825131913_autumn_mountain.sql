/*
  # Add Comprehensive Real Dataset

  This migration adds realistic data for a micro-lending business including:
  1. Real user profiles (owners, co-owners, agents)
  2. Multiple lending lines across different areas
  3. Diverse borrower profiles with realistic information
  4. Active and completed loans with payment histories
  5. Commission records and notifications
  6. Audit trails and system activities

  The data represents a typical micro-lending operation in India with
  multiple agents serving different geographical areas.
*/

-- Clear existing data
TRUNCATE TABLE audit_logs, notifications, commissions, fines, payments, loans, borrowers, lines, users RESTART IDENTITY CASCADE;

-- Insert Users (Owners, Co-owners, Agents)
INSERT INTO users (id, name, phone, role, is_active, created_at) VALUES
-- Owners
('550e8400-e29b-41d4-a716-446655440001', 'Rajesh Gupta', '+919876543210', 'owner', true, '2023-01-15 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'Priya Sharma', '+919876543211', 'co-owner', true, '2023-01-20 11:30:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'Amit Kumar', '+919876543212', 'co-owner', true, '2023-02-01 09:15:00+00'),

-- Field Agents
('550e8400-e29b-41d4-a716-446655440004', 'Sunita Devi', '+919876543213', 'agent', true, '2023-02-15 14:20:00+00'),
('550e8400-e29b-41d4-a716-446655440005', 'Mohan Singh', '+919876543214', 'agent', true, '2023-03-01 16:45:00+00'),
('550e8400-e29b-41d4-a716-446655440006', 'Kavita Rani', '+919876543215', 'agent', true, '2023-03-10 12:30:00+00'),
('550e8400-e29b-41d4-a716-446655440007', 'Ravi Prakash', '+919876543216', 'agent', true, '2023-03-15 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440008', 'Meera Joshi', '+919876543217', 'agent', true, '2023-04-01 13:15:00+00'),
('550e8400-e29b-41d4-a716-446655440009', 'Deepak Yadav', '+919876543218', 'agent', true, '2023-04-10 15:30:00+00'),
('550e8400-e29b-41d4-a716-446655440010', 'Anita Kumari', '+919876543219', 'agent', true, '2023-04-20 11:45:00+00');

-- Insert Lines (Different geographical areas and business types)
INSERT INTO lines (id, name, owner_id, co_owner_id, agent_id, initial_capital, current_balance, total_disbursed, total_collected, borrower_count, is_active, interest_rate, default_tenure, created_at) VALUES
-- Central Market Area
('line_001', 'Central Market - Vegetable Vendors', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 500000, 285000, 1250000, 1180000, 45, true, 2.5, 30, '2023-02-01 10:00:00+00'),

-- Industrial Area
('line_002', 'Industrial Area - Small Manufacturers', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 750000, 420000, 1800000, 1650000, 38, true, 2.2, 45, '2023-02-15 11:30:00+00'),

-- Residential Colony
('line_003', 'Residential Colony - Household Loans', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', 300000, 125000, 850000, 795000, 52, true, 2.8, 25, '2023-03-01 09:15:00+00'),

-- Rural Area
('line_004', 'Rural Area - Agricultural Support', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 400000, 180000, 950000, 885000, 28, true, 2.0, 60, '2023-03-15 14:20:00+00'),

-- Commercial Street
('line_005', 'Commercial Street - Shop Owners', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', 600000, 320000, 1400000, 1285000, 35, true, 2.3, 35, '2023-04-01 16:45:00+00'),

-- Women's Group
('line_006', 'Women Self Help Group', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440009', 250000, 95000, 650000, 615000, 42, true, 2.1, 20, '2023-04-15 12:30:00+00'),

-- Auto Rickshaw Drivers
('line_007', 'Auto Rickshaw Drivers Union', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 350000, 165000, 780000, 725000, 25, true, 2.4, 40, '2023-05-01 10:15:00+00');

-- Insert Borrowers (Diverse profiles across different lines)
INSERT INTO borrowers (id, line_id, name, phone, address, geolocation, is_high_risk, is_defaulter, total_loans, active_loans, total_repaid, outstanding_amount, credit_score, created_at, last_payment_date) VALUES

-- Central Market - Vegetable Vendors
('bor_001', 'line_001', 'Ramesh Chand', '+919876501001', 'Shop 15, Central Market, Sector 17, Chandigarh', POINT(76.7794, 30.7333), false, false, 8, 2, 125000, 18500, 780, '2023-02-05 10:30:00+00', '2024-12-20 14:30:00+00'),
('bor_002', 'line_001', 'Sushila Devi', '+919876501002', 'Shop 23, Vegetable Market, Phase 1, Mohali', POINT(76.7022, 30.7046), false, false, 6, 1, 95000, 12000, 750, '2023-02-10 11:45:00+00', '2024-12-19 16:20:00+00'),
('bor_003', 'line_001', 'Jagdish Kumar', '+919876501003', 'Stall 8, Sabzi Mandi, Sector 22, Chandigarh', POINT(76.7794, 30.7333), false, false, 12, 3, 185000, 25500, 720, '2023-02-15 09:20:00+00', '2024-12-21 10:15:00+00'),
('bor_004', 'line_001', 'Kamala Rani', '+919876501004', 'Shop 31, Main Market, Panchkula', POINT(76.8512, 30.6942), true, false, 15, 4, 220000, 35000, 680, '2023-02-20 15:10:00+00', '2024-12-18 12:45:00+00'),
('bor_005', 'line_001', 'Suresh Gupta', '+919876501005', 'Booth 12, Fruit Market, Sector 19, Chandigarh', POINT(76.7794, 30.7333), false, false, 5, 1, 75000, 8500, 790, '2023-03-01 12:30:00+00', '2024-12-20 09:30:00+00'),

-- Industrial Area - Small Manufacturers
('bor_006', 'line_002', 'Vinod Sharma', '+919876502001', 'Unit 45, Industrial Area Phase 1, Chandigarh', POINT(76.8294, 30.7614), false, false, 10, 2, 285000, 45000, 760, '2023-03-05 14:20:00+00', '2024-12-19 11:20:00+00'),
('bor_007', 'line_002', 'Rajesh Mittal', '+919876502002', 'Factory 23, HSIIDC, Barwala, Panchkula', POINT(76.9366, 30.6942), false, false, 7, 1, 195000, 28000, 740, '2023-03-10 16:45:00+00', '2024-12-21 15:10:00+00'),
('bor_008', 'line_002', 'Ashok Jindal', '+919876502003', 'Workshop 67, Industrial Estate, Mohali', POINT(76.6869, 30.7046), true, false, 18, 5, 420000, 85000, 650, '2023-03-15 10:15:00+00', '2024-12-17 13:25:00+00'),
('bor_009', 'line_002', 'Deepak Aggarwal', '+919876502004', 'Unit 89, Phase 2, Industrial Area, Chandigarh', POINT(76.8294, 30.7614), false, false, 9, 2, 245000, 32000, 770, '2023-03-20 13:30:00+00', '2024-12-20 17:40:00+00'),

-- Residential Colony - Household Loans
('bor_010', 'line_003', 'Sunita Kumari', '+919876503001', 'House 234, Sector 15, Chandigarh', POINT(76.7794, 30.7333), false, false, 4, 1, 45000, 8500, 800, '2023-03-25 11:20:00+00', '2024-12-21 08:15:00+00'),
('bor_011', 'line_003', 'Ravi Taneja', '+919876503002', 'Plot 156, Phase 3B2, Mohali', POINT(76.6869, 30.7046), false, false, 6, 2, 78000, 15500, 760, '2023-04-01 09:45:00+00', '2024-12-19 14:30:00+00'),
('bor_012', 'line_003', 'Neeta Sharma', '+919876503003', 'House 445, Sector 20, Panchkula', POINT(76.8512, 30.6942), false, false, 8, 1, 95000, 12000, 780, '2023-04-05 15:10:00+00', '2024-12-20 16:45:00+00'),
('bor_013', 'line_003', 'Manoj Gupta', '+919876503004', 'Flat 302, Green Valley, Zirakpur', POINT(76.8294, 30.6942), true, true, 12, 3, 85000, 45000, 580, '2023-04-10 12:25:00+00', '2024-12-10 10:20:00+00'),

-- Rural Area - Agricultural Support
('bor_014', 'line_004', 'Baldev Singh', '+919876504001', 'Village Khuda Lahora, Chandigarh', POINT(76.7794, 30.6942), false, false, 5, 1, 125000, 18000, 750, '2023-04-15 08:30:00+00', '2024-12-21 07:45:00+00'),
('bor_015', 'line_004', 'Gurpreet Kaur', '+919876504002', 'Village Mullanpur, Mohali', POINT(76.6869, 30.7333), false, false, 7, 2, 185000, 35000, 720, '2023-04-20 10:15:00+00', '2024-12-19 12:30:00+00'),
('bor_016', 'line_004', 'Harjeet Singh', '+919876504003', 'Village Raipur Rani, Panchkula', POINT(76.8512, 30.7614), false, false, 9, 2, 245000, 42000, 740, '2023-04-25 14:40:00+00', '2024-12-20 18:20:00+00'),

-- Commercial Street - Shop Owners
('bor_017', 'line_005', 'Anil Chopra', '+919876505001', 'Shop 45, Sector 17 Plaza, Chandigarh', POINT(76.7794, 30.7333), false, false, 11, 3, 285000, 55000, 710, '2023-05-01 11:30:00+00', '2024-12-21 13:15:00+00'),
('bor_018', 'line_005', 'Rakesh Bansal', '+919876505002', 'Store 23, City Centre, Mohali', POINT(76.6869, 30.7046), false, false, 8, 2, 195000, 28000, 760, '2023-05-05 16:20:00+00', '2024-12-20 11:40:00+00'),
('bor_019', 'line_005', 'Sanjay Malhotra', '+919876505003', 'Shop 67, Main Bazaar, Panchkula', POINT(76.8512, 30.6942), true, false, 14, 4, 325000, 75000, 670, '2023-05-10 13:45:00+00', '2024-12-18 15:25:00+00'),

-- Women Self Help Group
('bor_020', 'line_006', 'Pushpa Devi', '+919876506001', 'House 123, Women Colony, Sector 38, Chandigarh', POINT(76.7794, 30.7333), false, false, 3, 1, 25000, 5500, 820, '2023-05-15 09:10:00+00', '2024-12-21 14:20:00+00'),
('bor_021', 'line_006', 'Savita Rani', '+919876506002', 'Plot 89, Phase 7, Mohali', POINT(76.6869, 30.7046), false, false, 5, 2, 45000, 12000, 790, '2023-05-20 12:35:00+00', '2024-12-19 16:30:00+00'),
('bor_022', 'line_006', 'Kiran Bala', '+919876506003', 'House 234, Sector 12, Panchkula', POINT(76.8512, 30.6942), false, false, 4, 1, 35000, 8500, 800, '2023-05-25 15:50:00+00', '2024-12-20 10:45:00+00'),

-- Auto Rickshaw Drivers
('bor_023', 'line_007', 'Sukhdev Singh', '+919876507001', 'Auto Stand, Railway Station, Chandigarh', POINT(76.7794, 30.7333), false, false, 6, 2, 85000, 18500, 730, '2023-06-01 08:45:00+00', '2024-12-21 09:15:00+00'),
('bor_024', 'line_007', 'Ramesh Kumar', '+919876507002', 'Auto Stand, Bus Terminal, Mohali', POINT(76.6869, 30.7046), false, false, 8, 1, 125000, 15000, 750, '2023-06-05 11:20:00+00', '2024-12-20 12:30:00+00'),
('bor_025', 'line_007', 'Joginder Singh', '+919876507003', 'Auto Stand, Sector 5, Panchkula', POINT(76.8512, 30.6942), true, false, 12, 3, 165000, 45000, 680, '2023-06-10 14:15:00+00', '2024-12-17 16:40:00+00');

-- Insert Loans (Mix of active, completed, and overdue loans)
INSERT INTO loans (id, borrower_id, line_id, agent_id, amount, interest_rate, tenure, repayment_frequency, total_amount, paid_amount, remaining_amount, status, disbursed_at, due_date, next_payment_date, daily_amount, weekly_amount, monthly_amount, completed_at) VALUES

-- Active Loans
('loan_001', 'bor_001', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 15000, 2.5, 30, 'daily', 15375, 8500, 6875, 'active', '2024-11-15 10:30:00+00', '2024-12-15 10:30:00+00', '2024-12-22 10:30:00+00', 513, NULL, NULL, NULL),
('loan_002', 'bor_001', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 12000, 2.5, 25, 'daily', 12300, 4200, 8100, 'active', '2024-12-01 11:45:00+00', '2024-12-26 11:45:00+00', '2024-12-22 11:45:00+00', 492, NULL, NULL, NULL),

('loan_003', 'bor_002', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 12000, 2.5, 30, 'daily', 12300, 7800, 4500, 'active', '2024-11-20 09:20:00+00', '2024-12-20 09:20:00+00', '2024-12-22 09:20:00+00', 410, NULL, NULL, NULL),

('loan_004', 'bor_003', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 18000, 2.5, 35, 'weekly', 18450, 12500, 5950, 'active', '2024-11-10 15:10:00+00', '2024-12-15 15:10:00+00', '2024-12-22 15:10:00+00', NULL, 3690, NULL, NULL),
('loan_005', 'bor_003', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 15000, 2.5, 30, 'daily', 15375, 9200, 6175, 'active', '2024-11-25 12:30:00+00', '2024-12-25 12:30:00+00', '2024-12-22 12:30:00+00', 513, NULL, NULL, NULL),
('loan_006', 'bor_003', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 10000, 2.5, 20, 'daily', 10250, 3800, 6450, 'active', '2024-12-05 14:45:00+00', '2024-12-25 14:45:00+00', '2024-12-22 14:45:00+00', 513, NULL, NULL, NULL),

('loan_007', 'bor_004', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 25000, 2.5, 40, 'weekly', 25625, 15000, 10625, 'overdue', '2024-10-15 16:20:00+00', '2024-11-24 16:20:00+00', '2024-12-01 16:20:00+00', NULL, 5125, NULL, NULL),
('loan_008', 'bor_004', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 20000, 2.5, 35, 'daily', 20500, 12500, 8000, 'active', '2024-11-20 10:15:00+00', '2024-12-25 10:15:00+00', '2024-12-22 10:15:00+00', 585, NULL, NULL, NULL),
('loan_009', 'bor_004', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 15000, 2.5, 30, 'daily', 15375, 8500, 6875, 'active', '2024-12-01 13:40:00+00', '2024-12-31 13:40:00+00', '2024-12-22 13:40:00+00', 513, NULL, NULL, NULL),
('loan_010', 'bor_004', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 12000, 2.5, 25, 'daily', 12300, 4200, 8100, 'active', '2024-12-10 11:25:00+00', '2025-01-04 11:25:00+00', '2024-12-22 11:25:00+00', 492, NULL, NULL, NULL),

('loan_011', 'bor_005', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 8500, 2.5, 20, 'daily', 8713, 5200, 3513, 'active', '2024-12-05 09:30:00+00', '2024-12-25 09:30:00+00', '2024-12-22 09:30:00+00', 436, NULL, NULL, NULL),

-- Industrial Area Loans
('loan_012', 'bor_006', 'line_002', '550e8400-e29b-41d4-a716-446655440005', 35000, 2.2, 45, 'weekly', 35770, 22000, 13770, 'active', '2024-10-20 14:20:00+00', '2024-12-04 14:20:00+00', '2024-12-22 14:20:00+00', NULL, 5588, NULL, NULL),
('loan_013', 'bor_006', 'line_002', '550e8400-e29b-41d4-a716-446655440005', 28000, 2.2, 40, 'weekly', 28616, 18500, 10116, 'active', '2024-11-15 16:45:00+00', '2024-12-25 16:45:00+00', '2024-12-22 16:45:00+00', NULL, 4477, NULL, NULL),

('loan_014', 'bor_007', 'line_002', '550e8400-e29b-41d4-a716-446655440005', 28000, 2.2, 45, 'weekly', 28616, 18500, 10116, 'active', '2024-11-01 10:15:00+00', '2024-12-16 10:15:00+00', '2024-12-22 10:15:00+00', NULL, 4477, NULL, NULL),

-- Completed Loans
('loan_015', 'bor_001', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 10000, 2.5, 25, 'daily', 10250, 10250, 0, 'completed', '2024-09-15 10:30:00+00', '2024-10-10 10:30:00+00', '2024-10-10 10:30:00+00', 410, NULL, NULL, '2024-10-08 15:20:00+00'),
('loan_016', 'bor_002', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 8000, 2.5, 20, 'daily', 8200, 8200, 0, 'completed', '2024-10-01 11:45:00+00', '2024-10-21 11:45:00+00', '2024-10-21 11:45:00+00', 410, NULL, NULL, '2024-10-20 14:30:00+00'),
('loan_017', 'bor_003', 'line_001', '550e8400-e29b-41d4-a716-446655440004', 12000, 2.5, 30, 'daily', 12300, 12300, 0, 'completed', '2024-08-20 09:20:00+00', '2024-09-19 09:20:00+00', '2024-09-19 09:20:00+00', 410, NULL, NULL, '2024-09-18 16:45:00+00'),

-- Defaulted Loans
('loan_018', 'bor_013', 'line_003', '550e8400-e29b-41d4-a716-446655440006', 15000, 2.8, 25, 'daily', 15420, 8500, 6920, 'defaulted', '2024-09-01 12:25:00+00', '2024-09-26 12:25:00+00', '2024-09-26 12:25:00+00', 617, NULL, NULL, NULL);

-- Insert Payments (Comprehensive payment history)
INSERT INTO payments (id, loan_id, borrower_id, agent_id, amount, method, transaction_id, received_at, synced_at, is_offline, notes) VALUES

-- Recent payments for active loans
('pay_001', 'loan_001', 'bor_001', '550e8400-e29b-41d4-a716-446655440004', 513, 'cash', NULL, '2024-12-21 10:30:00+00', '2024-12-21 10:31:00+00', false, 'Daily EMI payment'),
('pay_002', 'loan_001', 'bor_001', '550e8400-e29b-41d4-a716-446655440004', 513, 'upi', 'UPI24122110301234', '2024-12-20 10:30:00+00', '2024-12-20 10:31:00+00', false, 'UPI payment via PhonePe'),
('pay_003', 'loan_001', 'bor_001', '550e8400-e29b-41d4-a716-446655440004', 513, 'cash', NULL, '2024-12-19 10:30:00+00', '2024-12-19 10:31:00+00', false, 'Daily EMI payment'),

('pay_004', 'loan_002', 'bor_001', '550e8400-e29b-41d4-a716-446655440004', 492, 'qr', 'QR24122111451567', '2024-12-21 11:45:00+00', '2024-12-21 11:46:00+00', false, 'QR code payment'),
('pay_005', 'loan_002', 'bor_001', '550e8400-e29b-41d4-a716-446655440004', 492, 'cash', NULL, '2024-12-20 11:45:00+00', '2024-12-20 11:46:00+00', false, 'Daily EMI payment'),

('pay_006', 'loan_003', 'bor_002', '550e8400-e29b-41d4-a716-446655440004', 410, 'phonepe', 'PP24122109202345', '2024-12-21 09:20:00+00', '2024-12-21 09:21:00+00', false, 'PhonePe wallet payment'),
('pay_007', 'loan_003', 'bor_002', '550e8400-e29b-41d4-a716-446655440004', 410, 'cash', NULL, '2024-12-20 09:20:00+00', '2024-12-20 09:21:00+00', false, 'Daily EMI payment'),

('pay_008', 'loan_004', 'bor_003', '550e8400-e29b-41d4-a716-446655440004', 3690, 'upi', 'UPI24122115103456', '2024-12-21 15:10:00+00', '2024-12-21 15:11:00+00', false, 'Weekly EMI payment'),
('pay_009', 'loan_004', 'bor_003', '550e8400-e29b-41d4-a716-446655440004', 3690, 'cash', NULL, '2024-12-14 15:10:00+00', '2024-12-14 15:11:00+00', false, 'Weekly EMI payment'),

('pay_010', 'loan_005', 'bor_003', '550e8400-e29b-41d4-a716-446655440004', 513, 'cash', NULL, '2024-12-21 12:30:00+00', '2024-12-21 12:31:00+00', false, 'Daily EMI payment'),
('pay_011', 'loan_005', 'bor_003', '550e8400-e29b-41d4-a716-446655440004', 1026, 'upi', 'UPI24122012304567', '2024-12-20 12:30:00+00', '2024-12-20 12:31:00+00', false, 'Double payment - advance'),

-- Bulk payments for completed loans
('pay_012', 'loan_015', 'bor_001', '550e8400-e29b-41d4-a716-446655440004', 10250, 'cash', NULL, '2024-10-08 15:20:00+00', '2024-10-08 15:21:00+00', false, 'Full loan closure payment'),
('pay_013', 'loan_016', 'bor_002', '550e8400-e29b-41d4-a716-446655440004', 8200, 'upi', 'UPI24102014305678', '2024-10-20 14:30:00+00', '2024-10-20 14:31:00+00', false, 'Full loan closure payment'),
('pay_014', 'loan_017', 'bor_003', '550e8400-e29b-41d4-a716-446655440004', 12300, 'cash', NULL, '2024-09-18 16:45:00+00', '2024-09-18 16:46:00+00', false, 'Full loan closure payment'),

-- Industrial area payments
('pay_015', 'loan_012', 'bor_006', '550e8400-e29b-41d4-a716-446655440005', 5588, 'upi', 'UPI24122114206789', '2024-12-21 14:20:00+00', '2024-12-21 14:21:00+00', false, 'Weekly EMI payment'),
('pay_016', 'loan_013', 'bor_006', '550e8400-e29b-41d4-a716-446655440005', 4477, 'cash', NULL, '2024-12-21 16:45:00+00', '2024-12-21 16:46:00+00', false, 'Weekly EMI payment'),

-- Offline payments (to be synced)
('pay_017', 'loan_008', 'bor_004', '550e8400-e29b-41d4-a716-446655440004', 585, 'cash', NULL, '2024-12-21 10:15:00+00', NULL, true, 'Offline cash payment - needs sync'),
('pay_018', 'loan_011', 'bor_005', '550e8400-e29b-41d4-a716-446655440004', 436, 'cash', NULL, '2024-12-21 09:30:00+00', NULL, true, 'Offline cash payment - needs sync');

-- Insert Commissions
INSERT INTO commissions (id, co_owner_id, line_id, amount, percentage, calculated_on, period, status, paid_at) VALUES
('comm_001', '550e8400-e29b-41d4-a716-446655440002', 'line_001', 11800, 10.0, 118000, '2024-11', 'paid', '2024-12-01 10:00:00+00'),
('comm_002', '550e8400-e29b-41d4-a716-446655440003', 'line_002', 16500, 10.0, 165000, '2024-11', 'paid', '2024-12-01 10:00:00+00'),
('comm_003', '550e8400-e29b-41d4-a716-446655440002', 'line_003', 7950, 10.0, 79500, '2024-11', 'paid', '2024-12-01 10:00:00+00'),
('comm_004', '550e8400-e29b-41d4-a716-446655440003', 'line_004', 8850, 10.0, 88500, '2024-11', 'paid', '2024-12-01 10:00:00+00'),
('comm_005', '550e8400-e29b-41d4-a716-446655440002', 'line_005', 12850, 10.0, 128500, '2024-11', 'paid', '2024-12-01 10:00:00+00'),
('comm_006', '550e8400-e29b-41d4-a716-446655440003', 'line_006', 6150, 10.0, 61500, '2024-11', 'paid', '2024-12-01 10:00:00+00'),
('comm_007', '550e8400-e29b-41d4-a716-446655440002', 'line_007', 7250, 10.0, 72500, '2024-11', 'paid', '2024-12-01 10:00:00+00'),

-- December commissions (pending)
('comm_008', '550e8400-e29b-41d4-a716-446655440002', 'line_001', 8500, 10.0, 85000, '2024-12', 'pending', NULL),
('comm_009', '550e8400-e29b-41d4-a716-446655440003', 'line_002', 12200, 10.0, 122000, '2024-12', 'pending', NULL),
('comm_010', '550e8400-e29b-41d4-a716-446655440002', 'line_003', 5800, 10.0, 58000, '2024-12', 'pending', NULL);

-- Insert Fines
INSERT INTO fines (id, loan_id, borrower_id, type, amount, reason, applied_at, is_paid) VALUES
('fine_001', 'loan_007', 'bor_004', 'delayed', 500, 'Payment delayed by 15 days', '2024-12-10 10:00:00+00', false),
('fine_002', 'loan_018', 'bor_013', 'missed', 750, 'Missed 3 consecutive payments', '2024-10-15 10:00:00+00', false),
('fine_003', 'loan_007', 'bor_004', 'partial', 250, 'Partial payment - ₹2000 short', '2024-12-05 10:00:00+00', true);

-- Insert Notifications
INSERT INTO notifications (id, user_id, type, title, message, is_read, created_at, action_url) VALUES
-- For Agents
('notif_001', '550e8400-e29b-41d4-a716-446655440004', 'payment_due', 'Payment Due Today', 'Ramesh Chand has a payment of ₹513 due today for loan #loan_001', false, '2024-12-22 06:00:00+00', '/loans/loan_001'),
('notif_002', '550e8400-e29b-41d4-a716-446655440004', 'payment_due', 'Payment Due Today', 'Sushila Devi has a payment of ₹410 due today for loan #loan_003', false, '2024-12-22 06:00:00+00', '/loans/loan_003'),
('notif_003', '550e8400-e29b-41d4-a716-446655440004', 'payment_overdue', 'Payment Overdue', 'Kamala Rani payment is overdue by 28 days for loan #loan_007', false, '2024-12-22 06:00:00+00', '/loans/loan_007'),

('notif_004', '550e8400-e29b-41d4-a716-446655440005', 'payment_due', 'Weekly Payment Due', 'Vinod Sharma has a weekly payment of ₹5588 due today', false, '2024-12-22 06:00:00+00', '/loans/loan_012'),
('notif_005', '550e8400-e29b-41d4-a716-446655440005', 'payment_due', 'Weekly Payment Due', 'Rajesh Mittal has a weekly payment of ₹4477 due today', false, '2024-12-22 06:00:00+00', '/loans/loan_013'),

-- For Co-owners
('notif_006', '550e8400-e29b-41d4-a716-446655440002', 'commission_paid', 'Commission Paid', 'Your commission of ₹11,800 for November has been credited', true, '2024-12-01 10:00:00+00', '/commissions'),
('notif_007', '550e8400-e29b-41d4-a716-446655440003', 'commission_paid', 'Commission Paid', 'Your commission of ₹16,500 for November has been credited', true, '2024-12-01 10:00:00+00', '/commissions'),

-- For Owner
('notif_008', '550e8400-e29b-41d4-a716-446655440001', 'system', 'Monthly Report Ready', 'November business report is ready for review. Total collection: ₹4,85,000', false, '2024-12-01 09:00:00+00', '/analytics'),
('notif_009', '550e8400-e29b-41d4-a716-446655440001', 'system', 'High Risk Alert', '3 borrowers have been marked as high risk. Review required.', false, '2024-12-20 08:00:00+00', '/borrowers?filter=high-risk'),
('notif_010', '550e8400-e29b-41d4-a716-446655440001', 'loan_approved', 'New Loan Disbursed', 'Loan of ₹12,000 disbursed to Ramesh Chand by agent Sunita Devi', true, '2024-12-01 11:45:00+00', '/loans/loan_002');

-- Insert Audit Logs
INSERT INTO audit_logs (id, user_id, action, table_name, record_id, old_values, new_values, created_at) VALUES
('audit_001', '550e8400-e29b-41d4-a716-446655440004', 'CREATE', 'payments', 'pay_001', NULL, '{"amount": 513, "method": "cash", "loan_id": "loan_001"}', '2024-12-21 10:31:00+00'),
('audit_002', '550e8400-e29b-41d4-a716-446655440004', 'CREATE', 'payments', 'pay_002', NULL, '{"amount": 513, "method": "upi", "loan_id": "loan_001"}', '2024-12-20 10:31:00+00'),
('audit_003', '550e8400-e29b-41d4-a716-446655440001', 'UPDATE', 'borrowers', 'bor_004', '{"is_high_risk": false}', '{"is_high_risk": true}', '2024-12-15 14:20:00+00'),
('audit_004', '550e8400-e29b-41d4-a716-446655440001', 'CREATE', 'loans', 'loan_002', NULL, '{"amount": 12000, "borrower_id": "bor_001", "status": "active"}', '2024-12-01 11:45:00+00'),
('audit_005', '550e8400-e29b-41d4-a716-446655440005', 'CREATE', 'payments', 'pay_015', NULL, '{"amount": 5588, "method": "upi", "loan_id": "loan_012"}', '2024-12-21 14:21:00+00');

-- Update sequences to match inserted data
SELECT setval('users_id_seq', (SELECT MAX(CAST(SUBSTRING(id FROM 37) AS INTEGER)) FROM users WHERE id LIKE '550e8400-e29b-41d4-a716-44665544%'));