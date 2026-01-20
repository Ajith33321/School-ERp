import { Request, Response, NextFunction } from 'express';
import pool from '../config/db.js';
import { catchAsync } from '../utils/errors.js';
import { AppError } from '../utils/errors.js';

/**
 * --- Exam Types ---
 */
export const getExamTypes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.user.organization_id;
    const result = await pool.query('SELECT * FROM exam_types WHERE organization_id = $1 ORDER BY display_order', [orgId]);
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createExamType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.user.organization_id;
    const { name, description, displayOrder } = req.body;
    const result = await pool.query(
        'INSERT INTO exam_types (organization_id, name, description, display_order) VALUES ($1, $2, $3, $4) RETURNING *',
        [orgId, name, description, displayOrder]
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
});

/**
 * --- Grading Systems ---
 */
export const getGradingSystems = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.user.organization_id;
    const systems = await pool.query('SELECT * FROM grading_systems WHERE organization_id = $1', [orgId]);

    // Fetch scales for each system
    const data = await Promise.all(systems.rows.map(async (system) => {
        const scales = await pool.query('SELECT * FROM grade_scales WHERE grading_system_id = $1 ORDER BY display_order', [system.id]);
        return { ...system, scales: scales.rows };
    }));

    res.status(200).json({ status: 'success', data });
});

export const createGradingSystem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.user.organization_id;
    const { name, description, scales } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const systemResult = await client.query(
            'INSERT INTO grading_systems (organization_id, name, description) VALUES ($1, $2, $3) RETURNING *',
            [orgId, name, description]
        );
        const systemId = systemResult.rows[0].id;

        for (const scale of scales) {
            await client.query(
                'INSERT INTO grade_scales (grading_system_id, grade_name, min_percentage, max_percentage, grade_point, display_order) VALUES ($1, $2, $3, $4, $5, $6)',
                [systemId, scale.grade_name, scale.min_percentage, scale.max_percentage, scale.grade_point, scale.display_order]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ status: 'success', data: systemResult.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
});

/**
 * --- Exams ---
 */
export const getExams = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.user.organization_id;
    const { academicYearId } = req.query;

    const result = await pool.query(
        'SELECT e.*, et.name as exam_type_name FROM exams e JOIN exam_types et ON e.exam_type_id = et.id WHERE e.organization_id = $1 AND e.academic_year_id = $2',
        [orgId, academicYearId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createExam = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.user.organization_id;
    const { academicYearId, termId, examTypeId, examName, startDate, endDate, resultPublishDate, gradingSystemId, syllabusPercentage } = req.body;

    const result = await pool.query(
        `INSERT INTO exams (
            organization_id, academic_year_id, term_id, exam_type_id, exam_name, 
            start_date, end_date, result_publish_date, grading_system_id, syllabus_percentage
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [orgId, academicYearId, termId, examTypeId, examName, startDate, endDate, resultPublishDate, gradingSystemId, syllabusPercentage]
    );

    res.status(201).json({ status: 'success', data: result.rows[0] });
});

/**
 * --- Exam Schedules ---
 */
export const createExamSchedule = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { examId, classId, sectionId, subjectId, examDate, startTime, endTime, roomNumber, maxMarks, passMarks, supervisorId, instructions } = req.body;

    const result = await pool.query(
        `INSERT INTO exam_schedules (
            exam_id, class_id, section_id, subject_id, exam_date, 
            start_time, end_time, room_number, max_marks, pass_marks, supervisor_id, instructions
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [examId, classId, sectionId, subjectId, examDate, startTime, endTime, roomNumber, maxMarks, passMarks, supervisorId, instructions]
    );

    res.status(201).json({ status: 'success', data: result.rows[0] });
});

export const getExamSchedules = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { examId, classId, sectionId } = req.query;
    let query = `
        SELECT es.*, s.name as subject_name, u.first_name as supervisor_first_name, u.last_name as supervisor_last_name
        FROM exam_schedules es
        JOIN subjects s ON es.subject_id = s.id
        LEFT JOIN users u ON es.supervisor_id = u.id
        WHERE es.exam_id = $1
    `;
    const params = [examId];

    if (classId) {
        query += ' AND es.class_id = $2';
        params.push(classId);
    }
    if (sectionId) {
        query += ' AND es.section_id = $3';
        params.push(sectionId);
    }

    query += ' ORDER BY es.exam_date, es.start_time';
    const result = await pool.query(query, params);
    res.status(200).json({ status: 'success', data: result.rows });
});

/**
 * --- Marks Entry ---
 */
export const getMarksForEntry = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { examScheduleId } = req.params;

    // Get schedule info
    const schedule = await pool.query('SELECT * FROM exam_schedules WHERE id = $1', [examScheduleId]);
    if (schedule.rows.length === 0) return next(new AppError('Exam schedule not found', 404));

    const { class_id, section_id } = schedule.rows[0];

    // Fetch students and their marks (if already entered)
    const query = `
        SELECT 
            s.id as student_id, s.roll_number, u.first_name, u.last_name,
            em.id as mark_id, em.marks_obtained, em.is_absent, em.remarks, em.status
        FROM students s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN exam_marks em ON em.student_id = s.id AND em.exam_schedule_id = $1
        WHERE s.class_id = $2 AND s.section_id = $3
        ORDER BY s.roll_number
    `;

    const result = await pool.query(query, [examScheduleId, class_id, section_id]);

    res.status(200).json({
        status: 'success',
        data: {
            schedule: schedule.rows[0],
            students: result.rows
        }
    });
});

export const saveMarks = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { examScheduleId } = req.params;
    const { marksData } = req.body; // Array of { studentId, marksObtained, isAbsent, remarks }
    const enteredBy = req.user.id;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        for (const item of marksData) {
            const query = `
                INSERT INTO exam_marks (
                    exam_schedule_id, student_id, marks_obtained, is_absent, remarks, entered_by, entered_at, status
                )
                VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, 'draft')
                ON CONFLICT (exam_schedule_id, student_id) DO UPDATE SET
                    marks_obtained = EXCLUDED.marks_obtained,
                    is_absent = EXCLUDED.is_absent,
                    remarks = EXCLUDED.remarks,
                    entered_by = EXCLUDED.entered_by,
                    entered_at = CURRENT_TIMESTAMP,
                    status = 'draft',
                    updated_at = CURRENT_TIMESTAMP
            `;
            // Again, need UNIQUE constraint on (exam_schedule_id, student_id)
            await client.query(query, [examScheduleId, item.studentId, item.marksObtained, item.isAbsent, item.remarks, enteredBy]);
        }

        await client.query('COMMIT');
        res.status(200).json({ status: 'success', message: 'Marks saved successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
});
