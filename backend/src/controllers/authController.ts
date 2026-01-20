import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '1d',
    });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
    const token = signToken(user.id);

    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password_hash = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            user,
        },
    });
};

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // Find user and join with role name
    const userResult = await query(
        'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = $1',
        [email]
    );

    const user = userResult.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // Ensure organization is active
    const orgResult = await query('SELECT status FROM organizations WHERE id = $1', [user.organization_id]);
    if (orgResult.rows[0]?.status !== 'active') {
        return next(new AppError('Organization account is inactive. Please contact support.', 403));
    }

    createSendToken(user, 200, res);
});

export const logout = (req: Request, res: Response) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

