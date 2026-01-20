-- Phase 15: ID Cards & Certificates

-- ID Card Templates
CREATE TABLE IF NOT EXISTS id_card_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    template_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) NOT NULL, -- 'student' or 'staff'
    template_design_json JSONB, -- Stores layout, fields, styling
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ID Card Print History
CREATE TABLE IF NOT EXISTS id_card_prints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    card_type VARCHAR(50) NOT NULL, -- 'student' or 'staff'
    entity_id UUID NOT NULL, -- student_id or user_id
    template_id UUID REFERENCES id_card_templates(id) ON DELETE SET NULL,
    printed_date DATE DEFAULT CURRENT_DATE,
    printed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    print_reason VARCHAR(100), -- 'new', 'lost', 'damaged', 'renewal'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Certificate Types
CREATE TABLE IF NOT EXISTS certificate_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- 'Transfer Certificate', 'Bonafide', etc.
    description TEXT,
    prefix VARCHAR(20), -- For certificate numbering (e.g., 'TC', 'BC')
    template_design_json JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Certificates Issued
CREATE TABLE IF NOT EXISTS certificates_issued (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    certificate_type_id UUID REFERENCES certificate_types(id) ON DELETE CASCADE,
    student_id UUID, -- Will reference students table
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    issued_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT,
    remarks TEXT,
    file_path TEXT,
    is_printed BOOLEAN DEFAULT FALSE,
    printed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Certificate Verification Log
CREATE TABLE IF NOT EXISTS certificate_verification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_number VARCHAR(100) NOT NULL,
    verified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_by VARCHAR(255), -- Can be external party
    status VARCHAR(50) DEFAULT 'verified',
    ip_address VARCHAR(50)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_id_card_templates_org ON id_card_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_id_card_prints_org ON id_card_prints(organization_id);
CREATE INDEX IF NOT EXISTS idx_id_card_prints_entity ON id_card_prints(entity_id);
CREATE INDEX IF NOT EXISTS idx_certificate_types_org ON certificate_types(organization_id);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_org ON certificates_issued(organization_id);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_student ON certificates_issued(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates_issued(certificate_number);
