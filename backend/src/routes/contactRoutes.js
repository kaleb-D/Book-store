import { Router } from 'express';
import {
  submitContact,
  getContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  downloadContactFile,
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadContactFiles, handleMulterError } from '../middleware/upload.js';
import {
  validateContact,
  validateObjectId,
  validatePagination,
} from '../middleware/validate.js';

const router = Router();

// Public route - submit contact form with optional file uploads
router.post(
  '/',
  uploadContactFiles.fields([
    { name: 'document', maxCount: 1 },
    { name: 'audioNote', maxCount: 1 },
  ]),
  handleMulterError,
  validateContact,
  submitContact
);

// Admin-only routes
router.get('/', protect, adminOnly, validatePagination, getContacts);
router.get('/:id/download/:fileType', protect, adminOnly, validateObjectId, downloadContactFile);
router.get('/:id', protect, adminOnly, validateObjectId, getContact);
router.patch(
  '/:id/status',
  protect,
  adminOnly,
  validateObjectId,
  updateContactStatus
);
router.delete('/:id', protect, adminOnly, validateObjectId, deleteContact);

export default router;
