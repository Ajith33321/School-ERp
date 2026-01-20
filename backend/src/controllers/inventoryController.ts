import { Request, Response } from 'express';
import pool from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

// VENDORS
export const getVendors = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const result = await pool.query(
        'SELECT * FROM vendors WHERE organization_id = $1 ORDER BY name',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createVendor = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const { name, contactPerson, email, phone, address, gstNumber } = req.body;
    const result = await pool.query(
        `INSERT INTO vendors (organization_id, name, contact_person, email, phone, address, gst_number) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [orgId, name, contactPerson, email, phone, address, gstNumber]
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
});

// ITEMS
export const getItems = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const result = await pool.query(
        `SELECT i.*, ic.name as category_name 
         FROM inventory_items i 
         JOIN inventory_categories ic ON i.category_id = ic.id 
         WHERE i.organization_id = $1`,
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createItem = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const { categoryId, name, code, unitOfMeasure, reorderLevel, description } = req.body;
    const result = await pool.query(
        `INSERT INTO inventory_items (organization_id, category_id, name, code, unit_of_measure, reorder_level, description) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [orgId, categoryId, name, code, unitOfMeasure, reorderLevel, description]
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
});

// STOCK INWARD
export const addStock = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const { vendorId, billNumber, billDate, totalAmount, remarks, items } = req.body;
    // items: [{itemId, quantity, unitPrice}]

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const stockInputRes = await client.query(
            `INSERT INTO inventory_stock_inputs (organization_id, vendor_id, bill_number, bill_date, total_amount, remarks) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [orgId, vendorId, billNumber, billDate, totalAmount, remarks]
        );
        const inputId = stockInputRes.rows[0].id;

        for (const item of items) {
            await client.query(
                `INSERT INTO inventory_stock_input_details (stock_input_id, item_id, quantity, unit_price) 
                 VALUES ($1, $2, $3, $4)`,
                [inputId, item.itemId, item.quantity, item.unitPrice]
            );

            // Update current stock
            await client.query(
                'UPDATE inventory_items SET current_stock = current_stock + $1 WHERE id = $2',
                [item.quantity, item.itemId]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ status: 'success', data: stockInputRes.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
});

// ITEM ISSUANCE
export const issueItem = catchAsync(async (req: Request, res: Response) => {
    const { itemId, issuedToUserId, quantity, remarks } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check stock
        const itemCheck = await client.query('SELECT current_stock FROM inventory_items WHERE id = $1 FOR UPDATE', [itemId]);
        if (itemCheck.rows.length === 0) throw new AppError('Item not found', 404);
        if (itemCheck.rows[0].current_stock < quantity) throw new AppError('Insufficient stock', 400);

        // Record issuance
        const issueRes = await client.query(
            `INSERT INTO item_issues (item_id, issued_to_user_id, quantity, remarks) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [itemId, issuedToUserId, quantity, remarks]
        );

        // Deduct stock
        await client.query(
            'UPDATE inventory_items SET current_stock = current_stock - $1 WHERE id = $2',
            [quantity, itemId]
        );

        await client.query('COMMIT');
        res.status(201).json({ status: 'success', data: issueRes.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
});

export const getInventoryCategories = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const result = await pool.query(
        'SELECT * FROM inventory_categories WHERE organization_id = $1 ORDER BY name',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createInventoryCategory = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const { name } = req.body;
    const result = await pool.query(
        'INSERT INTO inventory_categories (organization_id, name) VALUES ($1, $2) RETURNING *',
        [orgId, name]
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
});

export const getLowStockItems = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const result = await pool.query(
        `SELECT i.*, ic.name as category_name 
         FROM inventory_items i 
         JOIN inventory_categories ic ON i.category_id = ic.id 
         WHERE i.organization_id = $1 AND i.current_stock <= i.reorder_level`,
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});
