import { Request, Response, NextFunction } from 'express';
import { query } from '../config/db.js';
import { AppError, catchAsync } from '../utils/errors.js';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            organizationId?: string;
            organization?: any;
        }
    }
}

export const tenantHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let subdomain = '';

    // 1. Check for custom header (useful for testing)
    const tenantHeader = req.headers['x-tenant-id'] as string;

    if (tenantHeader) {
        const orgResult = await query('SELECT * FROM organizations WHERE id = $1 AND status = $2', [tenantHeader, 'active']);
        if (orgResult.rows.length === 0) {
            return next(new AppError('Invalid Tenant ID', 404));
        }
        req.organizationId = orgResult.rows[0].id;
        req.organization = orgResult.rows[0];
        return next();
    }

    // 2. Identify from subdomain
    const hostname = req.hostname;
    const parts = hostname.split('.');

    if (parts.length >= 3) {
        subdomain = parts[0];
        const orgResult = await query('SELECT * FROM organizations WHERE subdomain = $1 AND status = $2', [subdomain, 'active']);

        if (orgResult.rows.length > 0) {
            req.organizationId = orgResult.rows[0].id;
            req.organization = orgResult.rows[0];
            return next();
        }
    }

    // For public routes (like super-admin login or registration), we might not have an organizationId
    // The specific routes will handle the absence if needed
    next();
});

