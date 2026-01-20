import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as orgController from '../controllers/orgController.js';

const router = Router();

// Organization registration (Public)
router.post('/register-org', orgController.registerOrganization);

// Auth routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);

export default router;
