import { Request, Response, NextFunction } from 'express';
import { query } from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

// --- Classes ---

export const getClasses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await query(
        'SELECT * FROM classes WHERE organization_id = $1 ORDER BY display_order, name',
        [req.organizationId]
    );
    res.status(200).json({ success: true, data: result.rows });
});

export const createClass = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, short_name, level, display_order, capacity } = req.body;

    const result = await query(
        'INSERT INTO classes (name, short_name, level, display_order, capacity, organization_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, short_name, level, display_order, capacity, req.organizationId]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
});

export const updateClass = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, short_name, level, display_order, capacity, status } = req.body;

    const result = await query(
        'UPDATE classes SET name = $1, short_name = $2, level = $3, display_order = $4, capacity = $5, status = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 AND organization_id = $8 RETURNING *',
        [name, short_name, level, display_order, capacity, status, id, req.organizationId]
    );

    if (result.rows.length === 0) {
        return next(new AppError('Class not found', 404));
    }

    res.status(200).json({ success: true, data: result.rows[0] });
});

// --- Sections ---

export const getSections = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { classId } = req.query;
    let queryString = `
    SELECT s.*, c.name as class_name, u.first_name as teacher_first_name, u.last_name as teacher_last_name 
    FROM sections s 
    JOIN classes c ON s.class_id = c.id 
    LEFT JOIN users u ON s.class_teacher_id = u.id 
    WHERE c.organization_id = $1
  `;
    const params: any[] = [req.organizationId];

    if (classId) {
        queryString += ' AND s.class_id = $2';
        params.push(classId);
    }

    queryString += ' ORDER BY c.display_order, s.name';
    const result = await query(queryString, params);
    res.status(200).json({ success: true, data: result.rows });
});

export const createSection = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { class_id, name, capacity, class_teacher_id, room_number } = req.body;

    const result = await query(
        'INSERT INTO sections (class_id, name, capacity, class_teacher_id, room_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [class_id, name, capacity, class_teacher_id, room_number]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
});

// --- Subjects ---

export const getSubjects = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await query(
        'SELECT * FROM subjects WHERE organization_id = $1 ORDER BY name',
        [req.organizationId]
    );
    res.status(200).json({ success: true, data: result.rows });
});

export const createSubject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, code, subject_type, description } = req.body;

    const result = await query(
        'INSERT INTO subjects (name, code, subject_type, description, organization_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, code, subject_type, description, req.organizationId]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
});

export const mapSubjectToClass = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { class_id, subject_id, is_mandatory, max_marks, pass_marks, weightage } = req.body;

    const result = await query(
        'INSERT INTO class_subjects (class_id, subject_id, is_mandatory, max_marks, pass_marks, weightage) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [class_id, subject_id, is_mandatory, max_marks, pass_marks, weightage]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
});

export const getClassSubjects = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { classId } = req.params;
    const result = await query(
        `SELECT cs.*, s.name, s.code, s.subject_type 
         FROM class_subjects cs 
         JOIN subjects s ON cs.subject_id = s.id 
         WHERE cs.class_id = $1`,
        [classId]
    );
    res.status(200).json({ success: true, data: result.rows });
});
