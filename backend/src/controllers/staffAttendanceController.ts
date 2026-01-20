import { Request, Response, NextFunction } from 'express';
import pool from '../config/db.js';
import { catchAsync } from '../utils/errors.js';
import { AppError } from '../utils/errors.js';

/**
 * Staff Check-in
 * POST /api/attendance/staff/check-in
 */
export const staffCheckIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const orgId = req.user.organization_id;
    const { deviceId, ipAddress, locationLat, locationLong, remarks } = req.body;
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });

    // Check if already checked in
    const checkExisting = await pool.query(
        'SELECT * FROM staff_attendance WHERE user_id = $1 AND attendance_date = $2',
        [userId, date]
    );

    if (checkExisting.rows.length > 0) {
        return next(new AppError('Already checked in for today', 400));
    }

    const query = `
        INSERT INTO staff_attendance (
            organization_id, user_id, attendance_date, check_in_time, status, 
            device_id, ip_address, location_lat, location_long, remarks, marked_by
        )
        VALUES ($1, $2, $3, $4, 'present', $5, $6, $7, $8, $9, $10)
        RETURNING *
    `;

    const result = await pool.query(query, [
        orgId, userId, date, time,
        deviceId, ipAddress, locationLat, locationLong, remarks, userId
    ]);

    res.status(201).json({
        status: 'success',
        data: result.rows[0]
    });
});

/**
 * Staff Check-out
 * POST /api/attendance/staff/check-out
 */
export const staffCheckOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });

    // Find today's check-in
    const checkExisting = await pool.query(
        'SELECT * FROM staff_attendance WHERE user_id = $1 AND attendance_date = $2',
        [userId, date]
    );

    if (checkExisting.rows.length === 0) {
        return next(new AppError('No check-in found for today', 400));
    }

    if (checkExisting.rows[0].check_out_time) {
        return next(new AppError('Already checked out for today', 400));
    }

    const checkInTime = checkExisting.rows[0].check_in_time;
    // Calculate total hours (simplified)
    const inParts = checkInTime.split(':');
    const outParts = time.split(':');
    const totalHours = (parseInt(outParts[0]) + parseInt(outParts[1]) / 60) - (parseInt(inParts[0]) + parseInt(inParts[1]) / 60);

    const query = `
        UPDATE staff_attendance
        SET check_out_time = $1, total_hours = $2, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $3 AND attendance_date = $4
        RETURNING *
    `;

    const result = await pool.query(query, [time, totalHours.toFixed(2), userId, date]);

    res.status(200).json({
        status: 'success',
        data: result.rows[0]
    });
});

/**
 * Get staff attendance (self or for admin)
 * GET /api/attendance/staff?userId=...&startDate=...&endDate=...
 */
export const getStaffAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.user.organization_id;
    const { userId, startDate, endDate } = req.query;

    let targetUserId = userId || req.user.id;

    // Only Admin can see others
    if (targetUserId !== req.user.id && req.user.role_name !== 'School Admin') {
        return next(new AppError('Access denied', 403));
    }

    const query = `
        SELECT * FROM staff_attendance
        WHERE organization_id = $1 AND user_id = $2
        AND attendance_date BETWEEN $3 AND $4
        ORDER BY attendance_date DESC
    `;

    const result = await pool.query(query, [orgId, targetUserId, startDate, endDate]);

    res.status(200).json({
        status: 'success',
        data: result.rows
    });
});

/**
 * Manage Leave Types
 */
export const getLeaveTypes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.user.organization_id;
    const result = await pool.query('SELECT * FROM leave_types WHERE organization_id = $1', [orgId]);
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createLeaveType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.user.organization_id;
    const { name, totalDaysPerYear, isPaid, requiresApproval, canCarryForward, maxCarryForwardDays, description } = req.body;

    const query = `
        INSERT INTO leave_types (
            organization_id, name, total_days_per_year, is_paid, requires_approval, 
            can_carry_forward, max_carry_forward_days, description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;

    const result = await pool.query(query, [
        orgId, name, totalDaysPerYear, isPaid, requiresApproval,
        canCarryForward, maxCarryForwardDays, description
    ]);

    res.status(201).json({ status: 'success', data: result.rows[0] });
});

/**
 * Staff Leave Application
 */
export const applyStaffLeave = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const orgId = req.user.organization_id;
    const { leaveTypeId, fromDate, toDate, totalDays, reason } = req.body;

    // Check balance if needed
    // ...

    const query = `
        INSERT INTO staff_leave_applications (
            organization_id, user_id, leave_type_id, from_date, to_date, total_days, reason
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;

    const result = await pool.query(query, [orgId, userId, leaveTypeId, fromDate, toDate, totalDays, reason]);

    res.status(201).json({ status: 'success', data: result.rows[0] });
});

/**
 * Holiday Management
 */
export const getHolidays = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.user.organization_id;
    const result = await pool.query('SELECT * FROM holidays WHERE organization_id = $1 ORDER BY holiday_date', [orgId]);
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createHoliday = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.user.organization_id;
    const { holidayName, holidayDate, holidayType, description, applicableTo } = req.body;

    const query = `
        INSERT INTO holidays (organization_id, holiday_name, holiday_date, holiday_type, description, applicable_to)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;

    const result = await pool.query(query, [orgId, holidayName, holidayDate, holidayType, description, applicableTo]);

    res.status(201).json({ status: 'success', data: result.rows[0] });
});
