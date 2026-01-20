import express from 'express';
import * as attendanceController from '../controllers/attendanceController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Student Attendance
router.get('/students', restrictTo('School Admin', 'Teacher'), attendanceController.getStudentsForAttendance);
router.post('/students/mark', restrictTo('School Admin', 'Teacher'), attendanceController.markStudentAttendance);

// Student Leaves
router.post('/students/leaves/apply', attendanceController.applyStudentLeave);
router.get('/students/leaves/pending', restrictTo('School Admin', 'Teacher'), attendanceController.getPendingLeaveApplications);
router.put('/students/leaves/:id/approve', restrictTo('School Admin', 'Teacher'), attendanceController.approveLeaveApplication);

export default router;
