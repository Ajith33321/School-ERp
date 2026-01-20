import { Request, Response } from 'express';
import pool from '../config/db';

// Get all branches for an organization
export const getBranches = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.user!;

        const result = await pool.query(
            `SELECT b.*, 
                    u.first_name || ' ' || u.last_name as principal_name,
                    (SELECT COUNT(*) FROM branch_users WHERE branch_id = b.id) as staff_count
             FROM branches b
             LEFT JOIN users u ON b.principal_id = u.id
             WHERE b.organization_id = $1
             ORDER BY b.is_main_branch DESC, b.branch_name ASC`,
            [organizationId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({ error: 'Failed to fetch branches' });
    }
};

// Get single branch by ID
export const getBranchById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { organizationId } = req.user!;

        const result = await pool.query(
            `SELECT b.*, 
                    u.first_name || ' ' || u.last_name as principal_name,
                    (SELECT COUNT(*) FROM branch_users WHERE branch_id = b.id) as staff_count
             FROM branches b
             LEFT JOIN users u ON b.principal_id = u.id
             WHERE b.id = $1 AND b.organization_id = $2`,
            [id, organizationId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Branch not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching branch:', error);
        res.status(500).json({ error: 'Failed to fetch branch' });
    }
};

// Create new branch
export const createBranch = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.user!;
        const {
            branch_name,
            branch_code,
            address,
            city,
            state,
            country,
            pincode,
            contact_person,
            email,
            phone,
            principal_id,
            is_main_branch
        } = req.body;

        // Check if branch code already exists
        const existingBranch = await pool.query(
            'SELECT id FROM branches WHERE organization_id = $1 AND branch_code = $2',
            [organizationId, branch_code]
        );

        if (existingBranch.rows.length > 0) {
            return res.status(400).json({ error: 'Branch code already exists' });
        }

        const result = await pool.query(
            `INSERT INTO branches (
                organization_id, branch_name, branch_code, address, city, state, 
                country, pincode, contact_person, email, phone, principal_id, is_main_branch
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *`,
            [
                organizationId, branch_name, branch_code, address, city, state,
                country || 'India', pincode, contact_person, email, phone, principal_id, is_main_branch || false
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating branch:', error);
        res.status(500).json({ error: 'Failed to create branch' });
    }
};

// Update branch
export const updateBranch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { organizationId } = req.user!;
        const {
            branch_name,
            branch_code,
            address,
            city,
            state,
            country,
            pincode,
            contact_person,
            email,
            phone,
            principal_id,
            is_main_branch,
            status
        } = req.body;

        const result = await pool.query(
            `UPDATE branches SET
                branch_name = COALESCE($1, branch_name),
                branch_code = COALESCE($2, branch_code),
                address = COALESCE($3, address),
                city = COALESCE($4, city),
                state = COALESCE($5, state),
                country = COALESCE($6, country),
                pincode = COALESCE($7, pincode),
                contact_person = COALESCE($8, contact_person),
                email = COALESCE($9, email),
                phone = COALESCE($10, phone),
                principal_id = COALESCE($11, principal_id),
                is_main_branch = COALESCE($12, is_main_branch),
                status = COALESCE($13, status),
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $14 AND organization_id = $15
             RETURNING *`,
            [
                branch_name, branch_code, address, city, state, country, pincode,
                contact_person, email, phone, principal_id, is_main_branch, status, id, organizationId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Branch not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating branch:', error);
        res.status(500).json({ error: 'Failed to update branch' });
    }
};

// Delete branch
export const deleteBranch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { organizationId } = req.user!;

        // Check if branch has assigned staff or students
        const checkStaff = await pool.query(
            'SELECT COUNT(*) FROM branch_users WHERE branch_id = $1',
            [id]
        );

        if (parseInt(checkStaff.rows[0].count) > 0) {
            return res.status(400).json({
                error: 'Cannot delete branch with assigned staff. Please reassign staff first.'
            });
        }

        const result = await pool.query(
            'DELETE FROM branches WHERE id = $1 AND organization_id = $2 RETURNING *',
            [id, organizationId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Branch not found' });
        }

        res.json({ message: 'Branch deleted successfully' });
    } catch (error) {
        console.error('Error deleting branch:', error);
        res.status(500).json({ error: 'Failed to delete branch' });
    }
};

// Get staff assigned to a branch
export const getBranchStaff = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { organizationId } = req.user!;

        const result = await pool.query(
            `SELECT bu.*, 
                    u.first_name, u.last_name, u.email, u.phone,
                    r.name as role_name
             FROM branch_users bu
             JOIN users u ON bu.user_id = u.id
             LEFT JOIN roles r ON bu.role_id = r.id
             WHERE bu.branch_id = $1 AND u.organization_id = $2
             ORDER BY bu.assigned_date DESC`,
            [id, organizationId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching branch staff:', error);
        res.status(500).json({ error: 'Failed to fetch branch staff' });
    }
};

// Assign staff to branch
export const assignStaffToBranch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { user_id, role_id, is_primary_branch } = req.body;

        const result = await pool.query(
            `INSERT INTO branch_users (branch_id, user_id, role_id, is_primary_branch)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (branch_id, user_id) 
             DO UPDATE SET role_id = $3, is_primary_branch = $4
             RETURNING *`,
            [id, user_id, role_id, is_primary_branch || true]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error assigning staff to branch:', error);
        res.status(500).json({ error: 'Failed to assign staff to branch' });
    }
};
