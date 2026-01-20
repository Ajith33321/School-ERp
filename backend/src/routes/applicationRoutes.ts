import { Router } from 'express';
import * as applicationController from '../controllers/applicationController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

// Public route for submitting applications
router.post('/public', applicationController.createApplication);

// Protected admin routes
router.use(protect);
router.use(restrictTo('School Admin'));

router.get('/', applicationController.getApplications);
router.patch('/:id/status', applicationController.updateApplicationStatus);

export default router;
