import express from 'express';
import * as libraryController from '../controllers/libraryController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Categories
router.get('/categories', libraryController.getLibraryCategories);
router.post('/categories', restrictTo('admin', 'librarian'), libraryController.createLibraryCategory);

// Books
router.get('/books', libraryController.getBooks);
router.post('/books', restrictTo('admin', 'librarian'), libraryController.addBook);

// Issuance
router.post('/issue', restrictTo('admin', 'librarian'), libraryController.issueBook);
router.post('/return', restrictTo('admin', 'librarian'), libraryController.returnBook);
router.get('/members/:memberId/history', libraryController.getMemberHistory);

export default router;
