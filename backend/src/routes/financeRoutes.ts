import express from 'express';
import * as financeController from '../controllers/financeController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Fee Groups
router.get('/groups', financeController.getFeeGroups);
router.post('/groups', restrictTo('admin'), financeController.createFeeGroup);

// Fee Types
router.get('/types', financeController.getFeeTypes);
router.post('/types', restrictTo('admin'), financeController.createFeeType);

// Class Fee Structure
router.get('/class-structure', financeController.getClassFeeStructures);
router.post('/class-structure', restrictTo('admin'), financeController.setupClassFees);

// Fee Collection
router.post('/collect', restrictTo('admin', 'accountant'), financeController.collectFee);
router.get('/student-status', financeController.getStudentFeeStatus);

export default router;
