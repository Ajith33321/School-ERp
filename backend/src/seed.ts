import pool from './config/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seed() {
    const client = await pool.connect();
    try {
        // Initialize schema
        const schemaPath = path.join(__dirname, '../database/schema_sqlite.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        const statements = schema.split(';').filter(s => s.trim());

        for (const statement of statements) {
            await client.query(statement);
        }

        console.log('Schema initialized.');

        // 1. Create Organization
        const orgId = uuidv4();
        await client.query(
            "INSERT INTO organizations (id, name, subdomain, contact_email) VALUES ($1, 'Demo School', 'demo', 'admin@school.com')",
            [orgId]
        );

        // 2. Create Admin Role
        const roleId = uuidv4();
        await client.query(
            "INSERT INTO roles (id, name, organization_id, is_system_role) VALUES ($1, 'School Admin', $2, true)",
            [roleId, orgId]
        );

        // 3. Create Admin User
        const password = 'password123';
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        await client.query(
            "INSERT INTO users (id, email, password_hash, first_name, last_name, role_id, organization_id, status) VALUES ($1, $2, $3, 'Admin', 'User', $4, $5, 'active')",
            [uuidv4(), 'admin@school.com', hashedPassword, roleId, orgId]
        );

        console.log('Seeding successful!');
        console.log('Admin Email: admin@school.com');
        console.log('Admin Password: password123');
        console.log('Organization Subdomain: demo');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        process.exit();
    }
}

seed();
