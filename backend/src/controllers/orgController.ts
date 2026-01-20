import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import pool, { query } from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

export const registerOrganization = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {
        orgName,
        subdomain,
        email,
        password,
        firstName,
        lastName,
        phone,
        address
    } = req.body;

    // 1. Transaction to ensure both org and admin are created
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 2. Create Organization
        const orgResult = await client.query(
            'INSERT INTO organizations (name, subdomain, address, contact_email, contact_phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [orgName, subdomain, address, email, phone]
        );
        const orgId = orgResult.rows[0].id;

        // 3. Create Default Roles for this Org
        const adminRoleResult = await client.query(
            'INSERT INTO roles (name, description, organization_id, is_system_role) VALUES ($1, $2, $3, $4) RETURNING id',
            ['School Admin', 'Full access to school management', orgId, true]
        );
        const adminRoleId = adminRoleResult.rows[0].id;

        // Other roles (Teacher, Student, etc.) would be created here or via a seeding script
        const roles = ['Principal', 'Teacher', 'Accountant', 'Librarian', 'Student', 'Parent'];
        for (const roleName of roles) {
            await client.query(
                'INSERT INTO roles (name, organization_id, is_system_role) VALUES ($1, $2, $3)',
                [roleName, orgId, false]
            );
        }

        // 4. Create Admin User
        const hashedPassword = await bcrypt.hash(password, 12);
        const userResult = await client.query(
            'INSERT INTO users (email, password_hash, first_name, last_name, role_id, organization_id, phone, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, first_name, last_name',
            [email, hashedPassword, firstName, lastName, adminRoleId, orgId, phone, 'active']
        );

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: 'Organization and Admin user created successfully',
            data: {
                organization: { id: orgId, name: orgName, subdomain },
                user: userResult.rows[0]
            }
        });

    } catch (error: any) {
        await client.query('ROLLBACK');
        if (error.code === '23505') { // Unique constraint violation
            return next(new AppError('Subdomain or Email already exists', 400));
        }
        return next(error);
    } finally {
        client.release();
    }
});

