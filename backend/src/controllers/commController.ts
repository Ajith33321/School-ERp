import { Request, Response } from 'express';
import pool from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

// COMMUNICATION SETTINGS
export const getCommSettings = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const result = await pool.query(
        'SELECT * FROM comm_settings WHERE organization_id = $1',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows[0] });
});

export const updateCommSettings = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const {
        smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom,
        smsApiKey, smsSenderId, isEmailEnabled, isSmsEnabled
    } = req.body;

    const result = await pool.query(
        `INSERT INTO comm_settings (
            organization_id, smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from, 
            sms_api_key, sms_sender_id, is_email_enabled, is_sms_enabled
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (organization_id) DO UPDATE SET
            smtp_host = EXCLUDED.smtp_host,
            smtp_port = EXCLUDED.smtp_port,
            smtp_user = EXCLUDED.smtp_user,
            smtp_pass = EXCLUDED.smtp_pass,
            smtp_from = EXCLUDED.smtp_from,
            sms_api_key = EXCLUDED.sms_api_key,
            sms_sender_id = EXCLUDED.sms_sender_id,
            is_email_enabled = EXCLUDED.is_email_enabled,
            is_sms_enabled = EXCLUDED.is_sms_enabled,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *`,
        [orgId, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom, smsApiKey, smsSenderId, isEmailEnabled, isSmsEnabled]
    );

    res.status(200).json({ status: 'success', data: result.rows[0] });
});

// TEMPLATES
export const getTemplates = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const result = await pool.query(
        'SELECT * FROM comm_templates WHERE organization_id = $1 ORDER BY name',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createTemplate = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const { name, type, category, subject, body } = req.body;

    const result = await pool.query(
        `INSERT INTO comm_templates (organization_id, name, type, category, subject, body)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [orgId, name, type, category, subject, body]
    );

    res.status(201).json({ status: 'success', data: result.rows[0] });
});

// BROADCAST (Simulation for now)
export const sendBroadcast = catchAsync(async (req: Request, res: Response) => {
    const { orgId, user } = req;
    const { recipientType, channel, subject, content, recipients } = req.body;

    // Logic to actually send via SMTP or SMS API would go here
    // For now, we just log it

    const logResult = await pool.query(
        `INSERT INTO comm_logs (organization_id, sender_id, recipient_type, channel, subject, content, recipient_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [orgId, user?.id, recipientType, channel, subject, content, recipients?.length || 0]
    );

    res.status(200).json({
        status: 'success',
        message: `Broadcast queued successfully for ${recipients?.length || 0} recipients.`,
        data: logResult.rows[0]
    });
});

export const getCommLogs = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const result = await pool.query(
        `SELECT l.*, u.full_name as sender_name 
         FROM comm_logs l
         LEFT JOIN users u ON l.sender_id = u.id
         WHERE l.organization_id = $1 ORDER BY l.created_at DESC`,
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});
