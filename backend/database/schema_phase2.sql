-- Database Schema for School ERP (Phase 2: Student & Academic Management)

-- Academic Terms/Semesters
CREATE TABLE IF NOT EXISTS academic_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    term_name VARCHAR(100) NOT NULL, -- Term 1, Semester 1
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Classes
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(50),
    level INTEGER, -- For ordering (e.g., 10 for Class 10)
    display_order INTEGER DEFAULT 0,
    capacity INTEGER DEFAULT 40,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, organization_id)
);

-- Sections
CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    capacity INTEGER DEFAULT 40,
    class_teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    room_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, name)
);

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    subject_type VARCHAR(50) DEFAULT 'theory', -- theory, practical, both
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, organization_id)
);

-- Class Subjects
CREATE TABLE IF NOT EXISTS class_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN DEFAULT TRUE,
    max_marks DECIMAL(10, 2) DEFAULT 100,
    pass_marks DECIMAL(10, 2) DEFAULT 33,
    weightage INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, subject_id)
);

-- Pre-Admission Applications
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id),
    application_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255),
    parent_phone VARCHAR(50),
    parent_occupation VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(20),
    previous_school TEXT,
    previous_class VARCHAR(50),
    previous_percentage DECIMAL(5, 2),
    applying_for_class_id UUID REFERENCES classes(id),
    application_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, waitlisted
    application_date DATE DEFAULT CURRENT_DATE,
    interview_date TIMESTAMP WITH TIME ZONE,
    remarks TEXT,
    documents_json JSONB DEFAULT '{}',
    application_fee_paid BOOLEAN DEFAULT FALSE,
    payment_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Parents Master
CREATE TABLE IF NOT EXISTS parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    father_name VARCHAR(255),
    father_email VARCHAR(255),
    father_phone VARCHAR(50),
    father_occupation VARCHAR(100),
    mother_name VARCHAR(255),
    mother_email VARCHAR(255),
    mother_phone VARCHAR(50),
    mother_occupation VARCHAR(100),
    guardian_name VARCHAR(255),
    guardian_email VARCHAR(255),
    guardian_phone VARCHAR(50),
    guardian_relation VARCHAR(50),
    annual_income DECIMAL(15, 2),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(20),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- for login
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Students
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id),
    student_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. STU20230001
    admission_number VARCHAR(100) UNIQUE,
    admission_date DATE DEFAULT CURRENT_DATE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    email VARCHAR(255),
    phone VARCHAR(50),
    photo TEXT,
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    current_class_id UUID REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),
    roll_number INTEGER,
    house VARCHAR(50),
    religion VARCHAR(50),
    caste VARCHAR(50),
    category VARCHAR(50), -- general, obc, sc, st
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(20),
    previous_school TEXT,
    admission_class UUID REFERENCES classes(id),
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, passed_out, transferred
    remarks TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Student Documents
CREATE TABLE IF NOT EXISTS student_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- birth_cert, transfer_cert, etc
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES users(id)
);

-- Student Health
CREATE TABLE IF NOT EXISTS student_health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    height DECIMAL(5, 2),
    weight DECIMAL(5, 2),
    blood_group VARCHAR(10),
    allergies TEXT,
    medical_conditions TEXT,
    medications TEXT,
    doctor_name VARCHAR(255),
    doctor_phone VARCHAR(50),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Timetable Periods
CREATE TABLE IF NOT EXISTS timetable_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    period_name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    period_type VARCHAR(50) DEFAULT 'regular', -- regular, break, lunch
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Timetable
CREATE TABLE IF NOT EXISTS timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 1-7
    period_id UUID REFERENCES timetable_periods(id),
    subject_id UUID REFERENCES subjects(id),
    teacher_id UUID REFERENCES users(id),
    room_number VARCHAR(50),
    academic_year_id UUID REFERENCES academic_years(id),
    effective_from DATE,
    effective_to DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Homework
CREATE TABLE IF NOT EXISTS homework (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    homework_date DATE DEFAULT CURRENT_DATE,
    submission_date DATE,
    attachment_path TEXT,
    marks INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Homework Submissions
CREATE TABLE IF NOT EXISTS homework_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homework_id UUID REFERENCES homework(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submission_text TEXT,
    attachment_path TEXT,
    marks_obtained DECIMAL(5, 2),
    remarks TEXT,
    evaluated_by UUID REFERENCES users(id),
    evaluated_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'submitted', -- submitted, evaluated, late
    UNIQUE(homework_id, student_id)
);

-- Notices
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    notice_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    notice_type VARCHAR(50), -- general, academic, exam, event, holiday
    target_audience_json JSONB DEFAULT '{}',
    attachment_path TEXT,
    created_by UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    event_type VARCHAR(50),
    location VARCHAR(255),
    target_audience_json JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Additional indices
CREATE INDEX idx_students_org ON students(organization_id);
CREATE INDEX idx_students_class ON students(current_class_id);
CREATE INDEX idx_students_section ON students(section_id);
CREATE INDEX idx_applications_org ON applications(organization_id);
CREATE INDEX idx_timetable_class ON timetable(class_id, section_id);
CREATE INDEX idx_notices_org ON notices(organization_id);
