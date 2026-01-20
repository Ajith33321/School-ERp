import { Request, Response, NextFunction } from 'express';
import pool, { query } from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

export const createApplication = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {
        first_name, last_name, date_of_birth, gender, email, phone,
        parent_name, parent_email, parent_phone, parent_occupation,
        address, city, state, country, pincode,
        previous_school, previous_class, previous_percentage,
        applying_for_class_id, academic_year_id
    } = req.body;

    // Auto-generate application number (APP + Year + Random)
    const appNumber = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await query(
        `INSERT INTO applications (
      organization_id, academic_year_id, application_number, first_name, last_name, 
      date_of_birth, gender, email, phone, parent_name, parent_email, parent_phone, 
      parent_occupation, address, city, state, country, pincode, previous_school, 
      previous_class, previous_percentage, applying_for_class_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *`,
        [
            req.organizationId, academic_year_id, appNumber, first_name, last_name,
            date_of_birth, gender, email, phone, parent_name, parent_email, parent_phone,
            parent_occupation, address, city, state, country, pincode, previous_school,
            previous_class, previous_percentage, applying_for_class_id
        ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
});

export const getApplications = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { status, classId } = req.query;
    let queryString = 'SELECT a.*, c.name as class_name FROM applications a LEFT JOIN classes c ON a.applying_for_class_id = c.id WHERE a.organization_id = $1';
    const params: any[] = [req.organizationId];

    if (status) {
        queryString += ` AND a.application_status = $${params.length + 1}`;
        params.push(status);
    }

    if (classId) {
        queryString += ` AND a.applying_for_class_id = $${params.length + 1}`;
        params.push(classId);
    }

    queryString += ' ORDER BY a.created_at DESC';
    const result = await query(queryString, params);
    res.status(200).json({ success: true, data: result.rows });
});

export const updateApplicationStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status, remarks, interview_date } = req.body;

    const result = await query(
        'UPDATE applications SET application_status = $1, remarks = $2, interview_date = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND organization_id = $5 RETURNING *',
        [status, remarks, interview_date, id, req.organizationId]
    );

    if (result.rows.length === 0) {
        return next(new AppError('Application not found', 404));
    }

    res.status(200).json({ success: true, data: result.rows[0] });
});
