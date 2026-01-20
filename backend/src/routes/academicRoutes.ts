import { Router } from 'express';
import * as academicController from '../controllers/academicController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

// Protected routes
router.use(protect);

// Classes
router.get('/classes', academicController.getClasses);
router.post('/classes', restrictTo('School Admin'), academicController.createClass);
router.put('/classes/:id', restrictTo('School Admin'), academicController.updateClass);

// Sections
router.get('/sections', academicController.getSections);
router.post('/sections', restrictTo('School Admin'), academicController.createSection);

// Subjects
router.get('/subjects', academicController.getSubjects);
router.post('/subjects', restrictTo('School Admin'), academicController.createSubject);

// Class-Subject Mapping
router.get('/classes/:classId/subjects', academicController.getClassSubjects);
router.post('/class-subjects', restrictTo('School Admin'), academicController.mapSubjectToClass);

export default router;
