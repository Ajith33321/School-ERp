import express from 'express';
import {
    getOrgProfile,
    updateOrgProfile,
    getSessions,
    createSession,
    setCurrentSession
} from '../controllers/settingsController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getOrgProfile);
router.patch('/profile', restrictTo('admin', 'super-admin'), updateOrgProfile);

router.get('/sessions', getSessions);
router.post('/sessions', restrictTo('admin', 'super-admin'), createSession);
router.patch('/sessions/:sessionId/set-current', restrictTo('admin', 'super-admin'), setCurrentSession);

export default router;
