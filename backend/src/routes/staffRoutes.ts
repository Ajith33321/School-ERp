import express from 'express';
import {
    getLeaveTypes,
    createLeaveType,
    getLeaveApplications,
    applyLeave,
    reviewLeave,
    getStaffEntitlements
} from '../controllers/staffController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/leave-types', getLeaveTypes);
router.post('/leave-types', restrictTo('admin', 'super-admin'), createLeaveType);

router.get('/leaves', getLeaveApplications);
router.post('/leaves/apply', applyLeave);
router.patch('/leaves/:applicationId/review', restrictTo('admin', 'super-admin', 'registrar'), reviewLeave);

router.get('/my-entitlements', getStaffEntitlements);

export default router;
