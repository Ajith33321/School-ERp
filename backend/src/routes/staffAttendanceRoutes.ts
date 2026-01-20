import express from 'express';
import * as staffAttendanceController from '../controllers/staffAttendanceController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Staff Attendance
router.post('/check-in', staffAttendanceController.staffCheckIn);
router.post('/check-out', staffAttendanceController.staffCheckOut);
router.get('/', staffAttendanceController.getStaffAttendance);

// Leave Types
router.get('/leave-types', staffAttendanceController.getLeaveTypes);
router.post('/leave-types', restrictTo('School Admin'), staffAttendanceController.createLeaveType);

// Staff Leaves
router.post('/leaves/apply', staffAttendanceController.applyStaffLeave);

// Holidays
router.get('/holidays', staffAttendanceController.getHolidays);
router.post('/holidays', restrictTo('School Admin'), staffAttendanceController.createHoliday);

export default router;
