import { Request, Response, NextFunction } from 'express';
import pool from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

// SALARY COMPONENTS
export const getSalaryComponents = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const result = await pool.query(
        'SELECT * FROM salary_components WHERE organization_id = $1 ORDER BY type, name',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createSalaryComponent = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const { name, type, isFixed } = req.body;
    const result = await pool.query(
        'INSERT INTO salary_components (organization_id, name, type, is_fixed) VALUES ($1, $2, $3, $4) RETURNING *',
        [orgId, name, type, isFixed]
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
});

// STAFF SALARY STRUCTURE
export const getStaffSalaryStructure = catchAsync(async (req: Request, res: Response) => {
    const { staffId } = req.params;
    const result = await pool.query(
        `SELECT sc.id as component_id, sc.name, sc.type, COALESCE(sss.amount, 0) as amount
         FROM salary_components sc
         LEFT JOIN staff_salary_structures sss ON sc.id = sss.component_id AND sss.staff_id = $1
         WHERE sc.organization_id = (SELECT organization_id FROM users WHERE id = $1)`,
        [staffId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const setupStaffSalary = catchAsync(async (req: Request, res: Response) => {
    const { staffId, components } = req.body; // components: [{componentId, amount}]

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        for (const comp of components) {
            await client.query(
                `INSERT INTO staff_salary_structures (staff_id, component_id, amount)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (staff_id, component_id) DO UPDATE SET amount = EXCLUDED.amount`,
                [staffId, comp.componentId, comp.amount]
            );
        }
        await client.query('COMMIT');
        res.status(200).json({ status: 'success', message: 'Salary structure updated' });
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
});

// PAYROLL GENERATION
export const generatePayrollBatch = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const { month, year } = req.body;

    // 1. Create batch
    const batchRes = await pool.query(
        'INSERT INTO payroll_batches (organization_id, period_month, period_year) VALUES ($1, $2, $3) RETURNING *',
        [orgId, month, year]
    );
    const batchId = batchRes.rows[0].id;

    // 2. Fetch all staff with salary structure
    const staffRes = await pool.query(
        `SELECT u.id, u.first_name, u.last_name
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.organization_id = $1 AND r.name IN ('teacher', 'staff', 'admin')`,
        [orgId]
    );

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        for (const staff of staffRes.rows) {
            const salaryStructure = await client.query(
                `SELECT sss.amount, sc.name, sc.type 
                 FROM staff_salary_structures sss
                 JOIN salary_components sc ON sss.component_id = sc.id
                 WHERE sss.staff_id = $1`,
                [staff.id]
            );

            let gross = 0;
            let deductions = 0;
            const items = [];

            for (const row of salaryStructure.rows) {
                if (row.type === 'earning') gross += parseFloat(row.amount);
                else deductions += parseFloat(row.amount);
                items.push(row);
            }

            const net = gross - deductions;

            // Save payslip
            const payslipRes = await client.query(
                'INSERT INTO staff_payslips (payroll_batch_id, staff_id, gross_salary, total_deductions, net_salary) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [batchId, staff.id, gross, deductions, net]
            );
            const payslipId = payslipRes.rows[0].id;

            // Save items
            for (const item of items) {
                await client.query(
                    'INSERT INTO payslip_items (staff_payslip_id, component_name, component_type, amount) VALUES ($1, $2, $3, $4)',
                    [payslipId, item.name, item.type, item.amount]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ status: 'success', data: batchRes.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
});

export const getPayrollBatches = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const result = await pool.query(
        'SELECT * FROM payroll_batches WHERE organization_id = $1 ORDER BY period_year DESC, period_month DESC',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const getPayslipsForBatch = catchAsync(async (req: Request, res: Response) => {
    const { batchId } = req.params;
    const result = await pool.query(
        `SELECT sp.*, u.first_name, u.last_name 
         FROM staff_payslips sp 
         JOIN users u ON sp.staff_id = u.id 
         WHERE sp.payroll_batch_id = $1`,
        [batchId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});
