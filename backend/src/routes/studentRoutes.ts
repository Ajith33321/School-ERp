import { Router } from 'express';
import * as studentController from '../controllers/studentController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudentById);
router.post('/admit', restrictTo('School Admin'), studentController.admitStudent);

export default router;
