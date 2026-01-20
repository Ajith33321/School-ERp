import { Request, Response, NextFunction } from 'express';
import { query } from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // User is already attached to req by the protect middleware
    res.status(200).json({
        success: true,
        data: {
            user: req.user
        }
    });
});

export const getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { role, search, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let queryString = `
    SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.status, u.created_at, r.name as role_name 
    FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.organization_id = $1
  `;

    const params: any[] = [req.organizationId];
    let paramCount = 1;

    if (role) {
        paramCount++;
        queryString += ` AND r.name = $${paramCount}`;
        params.push(role);
    }

    if (search) {
        paramCount++;
        queryString += ` AND (u.first_name ILIKE $${paramCount} OR u.last_name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
        params.push(`%${search}%`);
    }

    queryString += ` ORDER BY u.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const users = await query(queryString, params);

    const totalCountResult = await query(
        'SELECT COUNT(*) FROM users WHERE organization_id = $1',
        [req.organizationId]
    );

    res.status(200).json({
        success: true,
        data: {
            users: users.rows,
            total: parseInt(totalCountResult.rows[0].count),
            page: Number(page),
            limit: Number(limit)
        }
    });
});

