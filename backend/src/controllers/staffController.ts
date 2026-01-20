import { Request, Response } from 'express';
import pool from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

// LEAVE TYPES
export const getLeaveTypes = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const result = await pool.query(
        'SELECT * FROM staff_leave_types WHERE organization_id = $1 ORDER BY name',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createLeaveType = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const { name, daysPerYear, isCarryForward } = req.body;

    const result = await pool.query(
        `INSERT INTO staff_leave_types (organization_id, name, days_per_year, is_carry_forward)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [orgId, name, daysPerYear, isCarryForward]
    );

    res.status(201).json({ status: 'success', data: result.rows[0] });
});

// LEAVE APPLICATIONS
export const getLeaveApplications = catchAsync(async (req: Request, res: Response) => {
    const { orgId, user } = req;
    const { status, staffId } = req.query;

    let query = `
        SELECT a.*, u.full_name as staff_name, t.name as leave_type_name
        FROM staff_leave_applications a
        JOIN users u ON a.staff_id = u.id
        JOIN staff_leave_types t ON a.leave_type_id = t.id
        WHERE a.organization_id = $1
    `;
    const params: any[] = [orgId];

    if (user?.role === 'staff') {
        query += ` AND a.staff_id = $${params.length + 1}`;
        params.push(user.id);
    } else if (staffId) {
        query += ` AND a.staff_id = $${params.length + 1}`;
        params.push(staffId);
    }

    if (status) {
        query += ` AND a.status = $${params.length + 1}`;
        params.push(status);
    }

    query += ' ORDER BY a.applied_at DESC';

    const result = await pool.query(query, params);
    res.status(200).json({ status: 'success', data: result.rows });
});

export const applyLeave = catchAsync(async (req: Request, res: Response) => {
    const { orgId, user } = req;
    const { leaveTypeId, startDate, endDate, totalDays, reason } = req.body;

    const result = await pool.query(
        `INSERT INTO staff_leave_applications (organization_id, staff_id, leave_type_id, start_date, end_date, total_days, reason)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [orgId, user?.id, leaveTypeId, startDate, endDate, totalDays, reason]
    );

    res.status(201).json({ status: 'success', data: result.rows[0] });
});

export const reviewLeave = catchAsync(async (req: Request, res: Response) => {
    const { orgId, user } = req;
    const { applicationId } = req.params;
    const { status, reviewRemarks } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Update application
        const application = await client.query(
            `UPDATE staff_leave_applications 
             SET status = $1, reviewed_by = $2, review_remarks = $3, updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 AND organization_id = $5 
             RETURNING *`,
            [status, user?.id, reviewRemarks, applicationId, orgId]
        );

        if (application.rows.length === 0) {
            throw new AppError('Leave application not found', 404);
        }

        // If approved, deduct from entitlement
        if (status === 'approved') {
            const app = application.rows[0];
            await client.query(
                `UPDATE staff_leave_entitlement 
                 SET used_quota = used_quota + $1, remaining_quota = remaining_quota - $1
                 WHERE staff_id = $2 AND leave_type_id = $3`,
                [app.total_days, app.staff_id, app.leave_type_id]
            );
        }

        await client.query('COMMIT');
        res.status(200).json({ status: 'success', data: application.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
});

// ENTITLEMENTS
export const getStaffEntitlements = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;
    const result = await pool.query(
        `SELECT e.*, t.name as leave_type_name
         FROM staff_leave_entitlement e
         JOIN staff_leave_types t ON e.leave_type_id = t.id
         WHERE e.staff_id = $1`,
        [user?.id]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});
