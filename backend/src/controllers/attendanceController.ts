import { Request, Response, NextFunction } from 'express';
import pool from '../config/db.js';
import { catchAsync } from '../utils/errors.js';
import { AppError } from '../utils/errors.js';

/**
 * Get students for attendance marking
 * GET /api/attendance/students?classId=...&sectionId=...&date=...
 */
export const getStudentsForAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { classId, sectionId, date } = req.query;
    const orgId = req.user.organization_id;

    if (!classId || !sectionId || !date) {
        return next(new AppError('Class ID, Section ID, and Date are required', 400));
    }

    // Fetch students in this class/section
    const studentQuery = `
        SELECT 
            s.id, s.admission_number, s.roll_number,
            u.first_name, u.last_name,
            at.status as current_status, at.remarks as current_remarks
        FROM students s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN student_attendance at ON at.student_id = s.id 
            AND at.attendance_date = $1 
            AND at.organization_id = $2
        WHERE s.class_id = $3 AND s.section_id = $4 AND s.organization_id = $2
        ORDER BY s.roll_number, u.first_name
    `;

    const students = await pool.query(studentQuery, [date, orgId, classId, sectionId]);

    res.status(200).json({
        status: 'success',
        data: students.rows
    });
});

/**
 * Bulk mark student attendance
 * POST /api/attendance/students/mark
 */
export const markStudentAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { classId, sectionId, date, attendanceData, academicYearId } = req.body;
    const orgId = req.user.organization_id;
    const markedBy = req.user.id;

    if (!classId || !sectionId || !date || !attendanceData || !Array.isArray(attendanceData)) {
        return next(new AppError('Invalid attendance data provided', 400));
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        for (const item of attendanceData) {
            const { studentId, status, remarks } = item;

            // Upsert attendance record
            const upsertQuery = `
                INSERT INTO student_attendance (
                    organization_id, academic_year_id, class_id, section_id,
                    student_id, attendance_date, status, marked_by, remarks
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (student_id, attendance_date) DO UPDATE SET
                    status = EXCLUDED.status,
                    marked_by = EXCLUDED.marked_by,
                    remarks = EXCLUDED.remarks,
                    updated_at = CURRENT_TIMESTAMP
            `;
            // Note: ON CONFLICT requires a unique constraint on (student_id, attendance_date)
            // I should add this constraint if not already in schema

            await client.query(upsertQuery, [
                orgId, academicYearId, classId, sectionId,
                studentId, date, status, markedBy, remarks
            ]);
        }

        await client.query('COMMIT');

        res.status(200).json({
            status: 'success',
            message: 'Attendance marked successfully'
        });
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
});

/**
 * Apply for student leave
 * POST /api/attendance/students/leaves/apply
 */
export const applyStudentLeave = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, leaveType, fromDate, toDate, totalDays, reason } = req.body;
    const orgId = req.user.organization_id;
    const appliedBy = req.user.id;

    const query = `
        INSERT INTO student_leave_applications (
            organization_id, student_id, leave_type, from_date, to_date, total_days, reason, applied_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;

    const result = await pool.query(query, [
        orgId, studentId, leaveType, fromDate, toDate, totalDays, reason, appliedBy
    ]);

    res.status(201).json({
        status: 'success',
        data: result.rows[0]
    });
});

/**
 * Get pending leave applications
 * GET /api/attendance/students/leaves/pending
 */
export const getPendingLeaveApplications = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.user.organization_id;

    const query = `
        SELECT 
            sla.*, 
            u.first_name, u.last_name,
            c.name as class_name, sec.name as section_name
        FROM student_leave_applications sla
        JOIN students s ON sla.student_id = s.id
        JOIN users u ON s.user_id = u.id
        JOIN classes c ON s.class_id = c.id
        JOIN sections sec ON s.section_id = sec.id
        WHERE sla.organization_id = $1 AND sla.approval_status = 'pending'
        ORDER BY sla.created_at DESC
    `;

    const result = await pool.query(query, [orgId]);

    res.status(200).json({
        status: 'success',
        data: result.rows
    });
});

/**
 * Approve/Reject leave application
 * PUT /api/attendance/students/leaves/:id/approve
 */
export const approveLeaveApplication = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status, remarks } = req.body; // status: 'approved' or 'rejected'
    const approvedBy = req.user.id;

    const query = `
        UPDATE student_leave_applications
        SET approval_status = $1, approval_remarks = $2, approved_by = $3, approval_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *
    `;

    const result = await pool.query(query, [status, remarks, approvedBy, id]);

    if (result.rows.length === 0) {
        return next(new AppError('Leave application not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: result.rows[0]
    });
});
