import express from 'express';
import * as inventoryController from '../controllers/inventoryController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Categories
router.get('/categories', inventoryController.getInventoryCategories);
router.post('/categories', restrictTo('admin'), inventoryController.createInventoryCategory);

// Vendors
router.get('/vendors', inventoryController.getVendors);
router.post('/vendors', restrictTo('admin'), inventoryController.createVendor);

// Items
router.get('/items', inventoryController.getItems);
router.post('/items', restrictTo('admin'), inventoryController.createItem);
router.get('/items/low-stock', restrictTo('admin'), inventoryController.getLowStockItems);

// Stock
router.post('/stock-in', restrictTo('admin'), inventoryController.addStock);
router.post('/issue', restrictTo('admin'), inventoryController.issueItem);

export default router;
