import { Request, Response, NextFunction } from 'express';
import pool from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

// FEE GROUPS
export const getFeeGroups = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const result = await pool.query(
        'SELECT * FROM fee_groups WHERE organization_id = $1 ORDER BY name',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createFeeGroup = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const { name, description } = req.body;
    const result = await pool.query(
        'INSERT INTO fee_groups (organization_id, name, description) VALUES ($1, $2, $3) RETURNING *',
        [orgId, name, description]
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
});

// FEE TYPES
export const getFeeTypes = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const result = await pool.query(
        'SELECT ft.*, fg.name as group_name FROM fee_types ft JOIN fee_groups fg ON ft.fee_group_id = fg.id WHERE ft.organization_id = $1',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createFeeType = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const { feeGroupId, name, code, isRecurring, frequency } = req.body;
    const result = await pool.query(
        'INSERT INTO fee_types (organization_id, fee_group_id, name, code, is_recurring, frequency) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [orgId, feeGroupId, name, code, isRecurring, frequency]
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
});

// CLASS FEE STRUCTURE
export const getClassFeeStructures = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const { classId, academicYearId } = req.query;
    const result = await pool.query(
        `SELECT cfs.*, ft.name as fee_name 
         FROM class_fee_structures cfs 
         JOIN fee_types ft ON cfs.fee_type_id = ft.id 
         WHERE cfs.organization_id = $1 AND cfs.class_id = $2 AND cfs.academic_year_id = $3`,
        [orgId, classId, academicYearId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const setupClassFees = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const { classId, academicYearId, fees } = req.body; // fees: [{feeTypeId, amount, dueDate}]

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        for (const fee of fees) {
            await client.query(
                `INSERT INTO class_fee_structures (organization_id, class_id, fee_type_id, amount, academic_year_id, due_date)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 ON CONFLICT (class_id, fee_type_id, academic_year_id) DO UPDATE 
                 SET amount = EXCLUDED.amount, due_date = EXCLUDED.due_date`,
                [orgId, classId, fee.feeTypeId, fee.amount, academicYearId, fee.dueDate]
            );
        }
        await client.query('COMMIT');
        res.status(200).json({ status: 'success', message: 'Fees set up successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
});

// FEE COLLECTION
export const collectFee = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const userId = (req as any).user.id;
    const { studentId, paymentDate, paymentMode, referenceNumber, remarks, collections } = req.body;
    // collections: [{classFeeStructureId, amountPaid, waiverAmount}]

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const totalAmount = collections.reduce((acc: number, curr: any) => acc + parseFloat(curr.amountPaid), 0);

        const feeCollectionRes = await client.query(
            'INSERT INTO fee_collections (organization_id, student_id, payment_date, total_amount, payment_mode, reference_number, remarks, collected_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [orgId, studentId, paymentDate || new Date(), totalAmount, paymentMode, referenceNumber, remarks, userId]
        );

        const collectionId = feeCollectionRes.rows[0].id;

        for (const item of collections) {
            await client.query(
                'INSERT INTO fee_collection_details (fee_collection_id, class_fee_structure_id, amount_paid, waiver_amount) VALUES ($1, $2, $3, $4)',
                [collectionId, item.classFeeStructureId, item.amountPaid, item.waiverAmount || 0]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ status: 'success', data: feeCollectionRes.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
});

export const getStudentFeeStatus = catchAsync(async (req: Request, res: Response) => {
    const { studentId, academicYearId } = req.query;

    // Get class for the student
    const studentRes = await pool.query('SELECT class_id FROM students WHERE id = $1', [studentId]);
    if (studentRes.rows.length === 0) throw new AppError('Student not found', 404);
    const classId = studentRes.rows[0].class_id;

    const result = await pool.query(
        `SELECT 
            cfs.id as structure_id,
            ft.name as fee_name,
            cfs.amount as total_amount,
            cfs.due_date,
            COALESCE(SUM(fcd.amount_paid), 0) as paid_amount,
            COALESCE(SUM(fcd.waiver_amount), 0) as waiver_amount,
            (cfs.amount - COALESCE(SUM(fcd.amount_paid), 0) - COALESCE(SUM(fcd.waiver_amount), 0)) as balance_amount
         FROM class_fee_structures cfs
         JOIN fee_types ft ON cfs.fee_type_id = ft.id
         LEFT JOIN fee_collection_details fcd ON cfs.id = fcd.class_fee_structure_id
         LEFT JOIN fee_collections fc ON fcd.fee_collection_id = fc.id AND fc.student_id = $1
         WHERE cfs.class_id = $2 AND cfs.academic_year_id = $3
         GROUP BY cfs.id, ft.name, cfs.amount, cfs.due_date`,
        [studentId, classId, academicYearId]
    );

    res.status(200).json({ status: 'success', data: result.rows });
});
