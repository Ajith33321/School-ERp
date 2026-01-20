import express from 'express';
import * as payrollController from '../controllers/payrollController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Salary Components
router.get('/components', payrollController.getSalaryComponents);
router.post('/components', restrictTo('admin'), payrollController.createSalaryComponent);

// Staff Salary Structure
router.get('/staff-salary/:staffId', payrollController.getStaffSalaryStructure);
router.post('/staff-salary', restrictTo('admin'), payrollController.setupStaffSalary);

// Payroll Processing
router.get('/batches', restrictTo('admin', 'accountant'), payrollController.getPayrollBatches);
router.post('/batches', restrictTo('admin', 'accountant'), payrollController.generatePayrollBatch);
router.get('/batches/:batchId/payslips', restrictTo('admin', 'accountant'), payrollController.getPayslipsForBatch);

export default router;
