-- Database Schema for School ERP (Phase 1)

-- Organizations (Multi-tenant isolation)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    custom_domain VARCHAR(255) UNIQUE,
    logo TEXT,
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    subscription_plan VARCHAR(50) DEFAULT 'basic',
    subscription_status VARCHAR(50) DEFAULT 'active',
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, organization_id)
);

-- Permissions
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(100) NOT NULL, -- e.g., 'users', 'students', 'fees'
    action VARCHAR(50) NOT NULL,  -- e.g., 'create', 'read', 'update', 'delete', 'approve'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(module, action)
);

-- Role Permissions (junction table)
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id UUID REFERENCES roles(id),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    phone VARCHAR(50),
    avatar TEXT,
    status VARCHAR(20) DEFAULT 'active',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email, organization_id)
);

-- Academic Years
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g., '2023-2024'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sessions (for Refresh Tokens)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Phase 13: Branch Management Tables

-- Branches (Multi-campus support)
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    branch_name VARCHAR(255) NOT NULL,
    branch_code VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(20),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    principal_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_main_branch BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, branch_code)
);

-- Branch Users (Staff assignment to branches)
CREATE TABLE IF NOT EXISTS branch_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    assigned_date DATE DEFAULT CURRENT_DATE,
    is_primary_branch BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(branch_id, user_id)
);

-- Branch Students (Student assignment to branches)
CREATE TABLE IF NOT EXISTS branch_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    student_id UUID, -- Will reference students table when created
    academic_year_id UUID, -- Will reference academic_years table when created
    assigned_date DATE DEFAULT CURRENT_DATE,
    transfer_date DATE,
    transfer_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_branches_organization ON branches(organization_id);
CREATE INDEX IF NOT EXISTS idx_branches_status ON branches(status);
CREATE INDEX IF NOT EXISTS idx_branch_users_branch ON branch_users(branch_id);
CREATE INDEX IF NOT EXISTS idx_branch_users_user ON branch_users(user_id);
CREATE INDEX IF NOT EXISTS idx_branch_students_branch ON branch_students(branch_id);
CREATE INDEX IF NOT EXISTS idx_branch_students_student ON branch_students(student_id);

-- Indices for performance
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_roles_org ON roles(organization_id);
CREATE INDEX idx_audit_org ON audit_logs(organization_id);
CREATE INDEX idx_user_email ON users(email);
