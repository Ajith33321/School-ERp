import express from 'express';
import {
    getHostels,
    createHostel,
    getRooms,
    createRoom,
    allocateRoom,
    vacateRoom
} from '../controllers/hostelController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getHostels);
router.post('/', restrictTo('admin', 'super-admin'), createHostel);

router.get('/:hostelId/rooms', getRooms);
router.post('/rooms', restrictTo('admin', 'super-admin'), createRoom);

router.post('/allocate', restrictTo('admin', 'super-admin', 'registrar'), allocateRoom);
router.patch('/vacate/:allocationId', restrictTo('admin', 'super-admin', 'registrar'), vacateRoom);

export default router;
