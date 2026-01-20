import { Request, Response } from 'express';
import pool from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

// LIBRARY CATEGORIES
export const getLibraryCategories = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const result = await pool.query(
        'SELECT * FROM library_categories WHERE organization_id = $1 ORDER BY name',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createLibraryCategory = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const { name } = req.body;
    const result = await pool.query(
        'INSERT INTO library_categories (organization_id, name) VALUES ($1, $2) RETURNING *',
        [orgId, name]
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
});

// BOOKS
export const getBooks = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const { categoryId, search } = req.query;

    let query = `
        SELECT b.*, lc.name as category_name 
        FROM books b 
        JOIN library_categories lc ON b.category_id = lc.id 
        WHERE b.organization_id = $1
    `;
    const params: any[] = [orgId];

    if (categoryId) {
        query += ` AND b.category_id = $${params.length + 1}`;
        params.push(categoryId);
    }

    if (search) {
        query += ` AND (b.title ILIKE $${params.length + 1} OR b.author ILIKE $${params.length + 1} OR b.isbn = $${params.length + 1})`;
        params.push(`%${search}%`);
    }

    const result = await pool.query(query, params);
    res.status(200).json({ status: 'success', data: result.rows });
});

export const addBook = catchAsync(async (req: Request, res: Response) => {
    const orgId = req.orgId;
    const {
        categoryId, title, author, isbn, publisher, edition,
        language, description, totalCopies, shelfLocation
    } = req.body;

    const result = await pool.query(
        `INSERT INTO books (
            organization_id, category_id, title, author, isbn, 
            publisher, edition, language, description, 
            total_copies, available_copies, shelf_location
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10, $11) RETURNING *`,
        [
            orgId, categoryId, title, author, isbn,
            publisher, edition, language, description,
            totalCopies, shelfLocation
        ]
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
});

// BOOK ISSUANCE
export const issueBook = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { bookId, memberId, dueDate } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Check book availability
        const bookCheck = await client.query('SELECT available_copies FROM books WHERE id = $1 FOR UPDATE', [bookId]);
        if (bookCheck.rows.length === 0) throw new AppError('Book not found', 404);
        if (bookCheck.rows[0].available_copies <= 0) throw new AppError('No copies available for issue', 400);

        // 2. Create issue record
        const issueRes = await client.query(
            `INSERT INTO book_issues (book_id, member_id, due_date, issued_by) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [bookId, memberId, dueDate, userId]
        );

        // 3. Decrement available copies
        await client.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [bookId]);

        await client.query('COMMIT');
        res.status(201).json({ status: 'success', data: issueRes.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
});

export const returnBook = catchAsync(async (req: Request, res: Response) => {
    const { issueId, fineAmount } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Update issue record
        const issueRes = await client.query(
            `UPDATE book_issues 
             SET return_date = CURRENT_DATE, fine_amount = $1, status = 'returned' 
             WHERE id = $2 RETURNING book_id`,
            [fineAmount || 0, issueId]
        );

        if (issueRes.rows.length === 0) throw new AppError('Issue record not found', 404);
        const bookId = issueRes.rows[0].book_id;

        // 2. Increment available copies
        await client.query('UPDATE books SET available_copies = available_copies + 1 WHERE id = $1', [bookId]);

        await client.query('COMMIT');
        res.status(200).json({ status: 'success', message: 'Book returned successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
});

export const getMemberHistory = catchAsync(async (req: Request, res: Response) => {
    const { memberId } = req.params;
    const result = await pool.query(
        `SELECT bi.*, b.title, b.author 
         FROM book_issues bi 
         JOIN books b ON bi.book_id = b.id 
         WHERE bi.member_id = $1 
         ORDER BY bi.issue_date DESC`,
        [memberId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});
