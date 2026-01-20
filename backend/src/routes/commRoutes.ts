import express from 'express';
import {
    getCommSettings,
    updateCommSettings,
    getTemplates,
    createTemplate,
    sendBroadcast,
    getCommLogs
} from '../controllers/commController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/settings', restrictTo('admin', 'super-admin'), getCommSettings);
router.post('/settings', restrictTo('admin', 'super-admin'), updateCommSettings);

router.get('/templates', getTemplates);
router.post('/templates', restrictTo('admin', 'super-admin'), createTemplate);

router.post('/broadcast', restrictTo('admin', 'super-admin'), sendBroadcast);
router.get('/logs', restrictTo('admin', 'super-admin'), getCommLogs);

export default router;
