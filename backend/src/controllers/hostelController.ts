import { Request, Response } from 'express';
import pool from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

// HOSTELS
export const getHostels = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const result = await pool.query(
        'SELECT * FROM hostels WHERE organization_id = $1 ORDER BY name',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createHostel = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const { name, type, address, wardenName, wardenPhone } = req.body;

    const result = await pool.query(
        `INSERT INTO hostels (organization_id, name, type, address, warden_name, warden_phone)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [orgId, name, type, address, wardenName, wardenPhone]
    );

    res.status(201).json({ status: 'success', data: result.rows[0] });
});

// ROOMS
export const getRooms = catchAsync(async (req: Request, res: Response) => {
    const { hostelId } = req.params;
    const result = await pool.query(
        'SELECT * FROM hostel_rooms WHERE hostel_id = $1 ORDER BY room_number',
        [hostelId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createRoom = catchAsync(async (req: Request, res: Response) => {
    const { hostelId, roomNumber, roomType, capacity, monthlyFee, description } = req.body;

    const result = await pool.query(
        `INSERT INTO hostel_rooms (hostel_id, room_number, room_type, capacity, monthly_fee, description)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [hostelId, roomNumber, roomType, capacity, monthlyFee, description]
    );

    res.status(201).json({ status: 'success', data: result.rows[0] });
});

// ALLOCATIONS
export const allocateRoom = catchAsync(async (req: Request, res: Response) => {
    const { studentId, roomId, allocationDate, remarks } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check capacity
        const roomCheck = await client.query(
            'SELECT capacity, occupied_beds FROM hostel_rooms WHERE id = $1',
            [roomId]
        );

        if (roomCheck.rows[0].occupied_beds >= roomCheck.rows[0].capacity) {
            throw new AppError('Room is already fully occupied', 400);
        }

        // Create allocation
        const allocationResult = await client.query(
            `INSERT INTO hostel_allocations (student_id, room_id, allocation_date, remarks)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [studentId, roomId, allocationDate || new Date(), remarks]
        );

        // Update occupied beds
        await client.query(
            'UPDATE hostel_rooms SET occupied_beds = occupied_beds + 1 WHERE id = $1',
            [roomId]
        );

        await client.query('COMMIT');
        res.status(201).json({ status: 'success', data: allocationResult.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
});

export const vacateRoom = catchAsync(async (req: Request, res: Response) => {
    const { allocationId } = req.params;
    const { vacateDate } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const allocation = await client.query(
            'UPDATE hostel_allocations SET vacate_date = $1, status = \'vacated\' WHERE id = $2 RETURNING room_id',
            [vacateDate || new Date(), allocationId]
        );

        if (allocation.rows.length > 0) {
            await client.query(
                'UPDATE hostel_rooms SET occupied_beds = occupied_beds - 1 WHERE id = $1',
                [allocation.rows[0].room_id]
            );
        }

        await client.query('COMMIT');
        res.status(200).json({ status: 'success', message: 'Room vacated successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
});
