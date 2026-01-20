import express from 'express';
import {
    getVehicles,
    createVehicle,
    getRoutes,
    createRoute,
    mapStudentToRoute,
    getRouteStops
} from '../controllers/transportController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/vehicles', getVehicles);
router.post('/vehicles', restrictTo('admin', 'super-admin'), createVehicle);

router.get('/routes', getRoutes);
router.post('/routes', restrictTo('admin', 'super-admin'), createRoute);
router.get('/routes/:routeId/stops', getRouteStops);

router.post('/map-student', restrictTo('admin', 'super-admin', 'registrar'), mapStudentToRoute);

export default router;
