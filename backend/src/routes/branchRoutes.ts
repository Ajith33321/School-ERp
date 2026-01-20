import express from 'express';
import { authenticate } from '../middleware/auth';
import {
    getBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
    getBranchStaff,
    assignStaffToBranch
} from '../controllers/branchController';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Branch CRUD
router.get('/', getBranches);
router.get('/:id', getBranchById);
router.post('/', createBranch);
router.put('/:id', updateBranch);
router.delete('/:id', deleteBranch);

// Branch staff management
router.get('/:id/staff', getBranchStaff);
router.post('/:id/staff', assignStaffToBranch);

export default router;
