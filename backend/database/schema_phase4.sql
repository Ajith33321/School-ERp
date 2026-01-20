-- Finance & Payroll Schema

-- FEE CONFIGURATION
CREATE TABLE fee_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fee_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    fee_group_id UUID REFERENCES fee_groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    is_recurring BOOLEAN DEFAULT TRUE,
    frequency VARCHAR(20) DEFAULT 'monthly', -- monthly, quarterly, yearly, one-time
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE class_fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    fee_type_id UUID REFERENCES fee_types(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    academic_year_id UUID NOT NULL,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, fee_type_id, academic_year_id)
);

CREATE TABLE student_fee_discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    fee_type_id UUID REFERENCES fee_types(id) ON DELETE CASCADE,
    discount_type VARCHAR(20) DEFAULT 'percentage', -- percentage, fixed
    value DECIMAL(12, 2) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fee_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    receipt_number SERIAL,
    payment_date DATE DEFAULT CURRENT_DATE,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_mode VARCHAR(20) NOT NULL, -- cash, cheque, online, bank_transfer
    reference_number VARCHAR(100),
    remarks TEXT,
    collected_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fee_collection_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fee_collection_id UUID REFERENCES fee_collections(id) ON DELETE CASCADE,
    class_fee_structure_id UUID REFERENCES class_fee_structures(id),
    amount_paid DECIMAL(12, 2) NOT NULL,
    waiver_amount DECIMAL(12, 2) DEFAULT 0
);

-- PAYROLL CONFIGURATION
CREATE TABLE salary_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- earning, deduction
    is_fixed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE staff_salary_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES users(id) ON DELETE CASCADE,
    component_id UUID REFERENCES salary_components(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, component_id)
);

CREATE TABLE payroll_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    period_month INTEGER NOT NULL,
    period_year INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, processed, paid
    total_gross DECIMAL(14, 2),
    total_deductions DECIMAL(14, 2),
    total_net DECIMAL(14, 2),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE staff_payslips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payroll_batch_id UUID REFERENCES payroll_batches(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES users(id) ON DELETE CASCADE,
    gross_salary DECIMAL(12, 2) NOT NULL,
    total_deductions DECIMAL(12, 2) NOT NULL,
    net_salary DECIMAL(12, 2) NOT NULL,
    attendance_days INTEGER,
    loss_of_pay_days DECIMAL(4, 2),
    status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, paid
    payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payslip_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_payslip_id UUID REFERENCES staff_payslips(id) ON DELETE CASCADE,
    component_name VARCHAR(100) NOT NULL,
    component_type VARCHAR(20) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL
);

-- EXPENSES
CREATE TABLE expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    category_id UUID REFERENCES expense_categories(id),
    title VARCHAR(200) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    expense_date DATE DEFAULT CURRENT_DATE,
    payment_mode VARCHAR(20),
    receipt_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
