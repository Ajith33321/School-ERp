-- Transportation & Hostel Schema

-- TRANSPORTATION MANAGEMENT
CREATE TABLE transport_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    vehicle_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_model VARCHAR(100),
    registration_year INTEGER,
    seating_capacity INTEGER NOT NULL,
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    driver_license VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active', -- active, maintenance, inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transport_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    route_name VARCHAR(100) NOT NULL,
    vehicle_id UUID REFERENCES transport_vehicles(id),
    total_distance DECIMAL(10, 2),
    monthly_fee DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transport_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES transport_routes(id) ON DELETE CASCADE,
    stop_name VARCHAR(100) NOT NULL,
    pickup_time TIME,
    drop_time TIME,
    sequence_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_transport_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    route_id UUID REFERENCES transport_routes(id) ON DELETE CASCADE,
    stop_id UUID REFERENCES transport_stops(id),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- HOSTEL MANAGEMENT
CREATE TABLE hostels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- boys, girls, common
    address TEXT,
    warden_name VARCHAR(100),
    warden_phone VARCHAR(20),
    total_rooms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hostel_rooms (
    id PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_id UUID REFERENCES hostels(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(50), -- single, double, triple, dormitory
    capacity INTEGER NOT NULL,
    occupied_beds INTEGER DEFAULT 0,
    monthly_fee DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hostel_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    room_id UUID REFERENCES hostel_rooms(id) ON DELETE CASCADE,
    allocation_date DATE DEFAULT CURRENT_DATE,
    vacate_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- active, vacated
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hostel_visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_id UUID REFERENCES hostels(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id),
    visitor_name VARCHAR(100) NOT NULL,
    relation VARCHAR(50),
    id_proof VARCHAR(50),
    entry_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP WITH TIME ZONE,
    remarks TEXT
);
