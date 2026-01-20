import express from 'express';
import * as examController from '../controllers/examController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Exam Types
router.get('/types', examController.getExamTypes);
router.post('/types', restrictTo('School Admin'), examController.createExamType);

// Grading Systems
router.get('/grading-systems', examController.getGradingSystems);
router.post('/grading-systems', restrictTo('School Admin'), examController.createGradingSystem);

// Exams
router.get('/', examController.getExams);
router.post('/', restrictTo('School Admin'), examController.createExam);

// Schedules
router.get('/schedules', examController.getExamSchedules);
router.post('/schedules', restrictTo('School Admin'), examController.createExamSchedule);

// Marks
router.get('/schedules/:examScheduleId/marks', restrictTo('School Admin', 'Teacher'), examController.getMarksForEntry);
router.post('/schedules/:examScheduleId/marks', restrictTo('School Admin', 'Teacher'), examController.saveMarks);

export default router;
