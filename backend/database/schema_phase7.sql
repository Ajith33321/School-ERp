-- Communication & HR Schema

-- COMMUNICATION CENTER
CREATE TABLE comm_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    smtp_host VARCHAR(255),
    smtp_port INTEGER,
    smtp_user VARCHAR(255),
    smtp_pass TEXT,
    smtp_from VARCHAR(255),
    sms_api_key TEXT,
    sms_sender_id VARCHAR(20),
    is_email_enabled BOOLEAN DEFAULT false,
    is_sms_enabled BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comm_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- email, sms
    category VARCHAR(50), -- admission, fee_reminder, exam_result
    subject VARCHAR(255),
    body TEXT NOT NULL,
    placeholders JSONB, -- list of supported tags like {{student_name}}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comm_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    recipient_type VARCHAR(20) NOT NULL, -- student, parent, staff, group
    channel VARCHAR(10) NOT NULL, -- email, sms
    subject VARCHAR(255),
    content TEXT NOT NULL,
    recipient_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'processed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- STAFF HR & LEAVE MANAGEMENT
CREATE TABLE staff_leave_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    days_per_year INTEGER NOT NULL,
    is_carry_forward BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE staff_leave_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leave_type_id UUID REFERENCES staff_leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(4, 1) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, cancelled
    reviewed_by UUID REFERENCES users(id),
    review_remarks TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE staff_leave_entitlement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leave_type_id UUID REFERENCES staff_leave_types(id) ON DELETE CASCADE,
    total_quota INTEGER NOT NULL,
    used_quota DECIMAL(4, 1) DEFAULT 0,
    remaining_quota DECIMAL(4, 1) NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id),
    UNIQUE(staff_id, leave_type_id, academic_year_id)
);
