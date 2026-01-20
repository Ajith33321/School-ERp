import { Request, Response, NextFunction } from 'express';
import pool, { query } from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';
import bcrypt from 'bcrypt';

export const admitStudent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {
        first_name, last_name, date_of_birth, gender, email, phone,
        blood_group, roll_number, house, religion, caste, category,
        address, city, state, country, pincode,
        current_class_id, section_id, academic_year_id,
        parent_details, // Object with father/mother details
        previous_school, admission_class,
        application_id // Optional: if converting from application
    } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Create/Find Parent Record
        const parentResult = await client.query(
            `INSERT INTO parents (
        organization_id, father_name, father_email, father_phone, father_occupation,
        mother_name, mother_email, mother_phone, mother_occupation,
        address, city, state, country, pincode
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
            [
                req.organizationId, parent_details.father_name, parent_details.father_email,
                parent_details.father_phone, parent_details.father_occupation,
                parent_details.mother_name, parent_details.mother_email,
                parent_details.mother_phone, parent_details.mother_occupation,
                address, city, state, country, pincode
            ]
        );
        const parentId = parentResult.rows[0].id;

        // 2. Generate Student Code (STU + Year + Next Val)
        const year = new Date().getFullYear();
        const countResult = await client.query('SELECT COUNT(*) FROM students WHERE organization_id = $1', [req.organizationId]);
        const studentCode = `STU${year}${(parseInt(countResult.rows[0].count) + 1).toString().padStart(4, '0')}`;
        const admissionNumber = `ADM${year}${(parseInt(countResult.rows[0].count) + 1).toString().padStart(4, '0')}`;

        // 3. Create Student Record
        const studentResult = await client.query(
            `INSERT INTO students (
        organization_id, academic_year_id, student_code, admission_number, 
        first_name, last_name, date_of_birth, gender, blood_group, email, phone,
        parent_id, current_class_id, section_id, roll_number, house, religion, 
        caste, category, address, city, state, country, pincode, previous_school, 
        admission_class, status, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28) RETURNING *`,
            [
                req.organizationId, academic_year_id, studentCode, admissionNumber,
                first_name, last_name, date_of_birth, gender, blood_group, email, phone,
                parentId, current_class_id, section_id, roll_number, house, religion,
                caste, category, address, city, state, country, pincode, previous_school,
                admission_class, 'active', req.user.id
            ]
        );

        // 4. Update Application status if applicable
        if (application_id) {
            await client.query(
                'UPDATE applications SET application_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                ['approved', application_id]
            );
        }

        // 5. Create Parent User Account (Optional but recommended)
        const parentEmail = parent_details.father_email || parent_details.mother_email;
        if (parentEmail) {
            const hashedPassword = await bcrypt.hash('Parent@123', 12); // Default password
            // Find Parent Role ID
            const roleResult = await client.query('SELECT id FROM roles WHERE name = $1 AND organization_id = $2', ['Parent', req.organizationId]);
            if (roleResult.rows.length > 0) {
                await client.query(
                    'INSERT INTO users (email, password_hash, first_name, last_name, role_id, organization_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                    [parentEmail, hashedPassword, parent_details.father_name || 'Parent', last_name, roleResult.rows[0].id, req.organizationId, 'active']
                );
            }
        }

        await client.query('COMMIT');

        res.status(201).json({ success: true, data: studentResult.rows[0] });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
});

export const getStudents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { classId, sectionId, search } = req.query;
    let queryString = `
    SELECT s.*, c.name as class_name, sec.name as section_name, 
           p.father_name, p.mother_name, p.father_phone 
    FROM students s 
    LEFT JOIN classes c ON s.current_class_id = c.id 
    LEFT JOIN sections sec ON s.section_id = sec.id 
    LEFT JOIN parents p ON s.parent_id = p.id 
    WHERE s.organization_id = $1
  `;
    const params: any[] = [req.organizationId];

    if (classId) {
        queryString += ` AND s.current_class_id = $${params.length + 1}`;
        params.push(classId);
    }

    if (sectionId) {
        queryString += ` AND s.section_id = $${params.length + 1}`;
        params.push(sectionId);
    }

    if (search) {
        queryString += ` AND (s.first_name ILIKE $${params.length + 1} OR s.last_name ILIKE $${params.length + 1} OR s.student_code ILIKE $${params.length + 1})`;
        params.push(`%${search}%`);
    }

    queryString += ' ORDER BY s.first_name, s.last_name';
    const result = await query(queryString, params);
    res.status(200).json({ success: true, data: result.rows });
});

export const getStudentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await query(
        `SELECT s.*, c.name as class_name, sec.name as section_name, p.* 
         FROM students s 
         LEFT JOIN classes c ON s.current_class_id = c.id 
         LEFT JOIN sections sec ON s.section_id = sec.id 
         LEFT JOIN parents p ON s.parent_id = p.id 
         WHERE s.id = $1 AND s.organization_id = $2`,
        [id, req.organizationId]
    );

    if (result.rows.length === 0) {
        return next(new AppError('Student not found', 404));
    }

    res.status(200).json({ success: true, data: result.rows[0] });
});
