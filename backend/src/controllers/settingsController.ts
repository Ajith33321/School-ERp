import { Request, Response } from 'express';
import pool from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

// ORGANIZATION PROFILE
export const getOrgProfile = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const result = await pool.query(
        'SELECT * FROM organizations WHERE id = $1',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows[0] });
});

export const updateOrgProfile = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const { name, address, phone, email, website, logo_url } = req.body;

    const result = await pool.query(
        `UPDATE organizations 
         SET name = $1, address = $2, phone = $3, email = $4, website = $5, logo_url = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 RETURNING *`,
        [name, address, phone, email, website, logo_url, orgId]
    );

    res.status(200).json({ status: 'success', data: result.rows[0] });
});

// ACADEMIC YEARS / SESSIONS
export const getSessions = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const result = await pool.query(
        'SELECT * FROM academic_years WHERE organization_id = $1 ORDER BY start_date DESC',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createSession = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const { name, startDate, endDate, isCurrent } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        if (isCurrent) {
            await client.query(
                'UPDATE academic_years SET is_current = false WHERE organization_id = $1',
                [orgId]
            );
        }

        const result = await client.query(
            `INSERT INTO academic_years (organization_id, name, start_date, end_date, is_current)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [orgId, name, startDate, endDate, isCurrent]
        );

        await client.query('COMMIT');
        res.status(201).json({ status: 'success', data: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
});

export const setCurrentSession = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const { sessionId } = req.params;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query(
            'UPDATE academic_years SET is_current = false WHERE organization_id = $1',
            [orgId]
        );

        const result = await client.query(
            'UPDATE academic_years SET is_current = true WHERE id = $1 AND organization_id = $2 RETURNING *',
            [sessionId, orgId]
        );

        await client.query('COMMIT');
        res.status(200).json({ status: 'success', data: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
});
