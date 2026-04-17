import { Router } from 'express';
//import passport from 'passport';
import {
  register,
  login,
  googleCallback,
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';

const router = Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Google OAuth routes
/*router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/auth/google/failure',
  }),
  googleCallback
);

router.get('/google/failure', (_req, res) => {
  res.status(401).json({
    success: false,
    error: 'Google authentication failed',
  });
});
*/
// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

export default router;
