import { Router } from 'express';
import {
  getDashboardStats, 
  getUsers,
  getUser,
  updateUserRole,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateObjectId, validatePagination } from '../middleware/validate.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', validatePagination, getUsers);
router.get('/users/:id', validateObjectId, getUser);
router.patch('/users/:id/role', validateObjectId, updateUserRole);

export default router;
