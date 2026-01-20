import { Request, Response } from 'express';
import pool from '../config/db.js';
import { catchAsync, AppError } from '../utils/errors.js';

// VEHICLES
export const getVehicles = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const result = await pool.query(
        'SELECT * FROM transport_vehicles WHERE organization_id = $1 ORDER BY vehicle_number',
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createVehicle = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const { vehicleNumber, vehicleModel, seatingCapacity, driverName, driverPhone, driverLicense } = req.body;

    const result = await pool.query(
        `INSERT INTO transport_vehicles (organization_id, vehicle_number, vehicle_model, seating_capacity, driver_name, driver_phone, driver_license)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [orgId, vehicleNumber, vehicleModel, seatingCapacity, driverName, driverPhone, driverLicense]
    );

    res.status(201).json({ status: 'success', data: result.rows[0] });
});

// ROUTES
export const getRoutes = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const result = await pool.query(
        `SELECT r.*, v.vehicle_number, v.driver_name 
         FROM transport_routes r
         LEFT JOIN transport_vehicles v ON r.vehicle_id = v.id
         WHERE r.organization_id = $1 ORDER BY r.route_name`,
        [orgId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});

export const createRoute = catchAsync(async (req: Request, res: Response) => {
    const { orgId } = req;
    const { routeName, vehicleId, monthlyFee, stops } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const routeResult = await client.query(
            `INSERT INTO transport_routes (organization_id, route_name, vehicle_id, monthly_fee)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [orgId, routeName, vehicleId, monthlyFee]
        );

        const routeId = routeResult.rows[0].id;

        if (stops && stops.length > 0) {
            for (let i = 0; i < stops.length; i++) {
                const { stopName, pickupTime, dropTime } = stops[i];
                await client.query(
                    `INSERT INTO transport_stops (route_id, stop_name, pickup_time, drop_time, sequence_order)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [routeId, stopName, pickupTime, dropTime, i + 1]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ status: 'success', data: routeResult.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
});

// STUDENT MAPPING
export const mapStudentToRoute = catchAsync(async (req: Request, res: Response) => {
    const { studentId, routeId, stopId, startDate } = req.body;

    const result = await pool.query(
        `INSERT INTO student_transport_mapping (student_id, route_id, stop_id, start_date)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [studentId, routeId, stopId, startDate || new Date()]
    );

    res.status(201).json({ status: 'success', data: result.rows[0] });
});

export const getRouteStops = catchAsync(async (req: Request, res: Response) => {
    const { routeId } = req.params;
    const result = await pool.query(
        'SELECT * FROM transport_stops WHERE route_id = $1 ORDER BY sequence_order',
        [routeId]
    );
    res.status(200).json({ status: 'success', data: result.rows });
});
