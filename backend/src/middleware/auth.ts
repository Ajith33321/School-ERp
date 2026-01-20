import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError, catchAsync } from '../utils/errors.js';
import { query } from '../config/db.js';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2. Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 3. Check if user still exists
    const userResult = await query(
        'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1',
        [decoded.id]
    );

    if (userResult.rows.length === 0) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    const user = userResult.rows[0];

    // 4. Ensure user belongs to the current tenant (if applicable)
    if (req.organizationId && user.organization_id !== req.organizationId) {
        return next(new AppError('Unauthorized access to this organization.', 403));
    }

    // Grant access
    req.user = user;
    next();
});

export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role_name)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

