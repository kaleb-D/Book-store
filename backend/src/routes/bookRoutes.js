import { Router } from 'express';
import multer from 'multer';
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadBookImage, handleMulterError } from '../middleware/upload.js';
import {
  validateBook,
  validateObjectId,
  validatePagination,
} from '../middleware/validate.js';

const router = Router();
const storage = multer.memoryStorage(); // Keeps the file in RAM temporarily
const upload = multer({ storage });

// Public routes
router.get('/', validatePagination, getBooks);
router.get('/:id', validateObjectId, getBook);

// Admin-only routes
router.post(
  '/',
  protect,
  adminOnly,
  uploadBookImage.single('coverImage'),
  handleMulterError,
  validateBook,
  createBook
);

router.put(
  '/:id',
  protect,
  adminOnly,
  uploadBookImage.single('coverImage'),
  handleMulterError,
  validateObjectId,
  updateBook
);

router.delete('/:id', protect, adminOnly, validateObjectId, deleteBook);

export default router;
