import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

/**
 * Generate JWT token for a given user ID.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Format user response with token.
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists',
      });
    }

    const user = await User.create({ name, email, password });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user with email & password
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Check if user registered via Google (no password set)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        error: 'This account uses Google sign-in. Please use Google to log in.',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Handle Google OAuth callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
export const googleCallback = (req, res) => {
  const token = generateToken(req.user._id);

  // Redirect to frontend with token
  const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(`${clientURL}/auth/google/success?token=${token}`);
};

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = { name: req.body.name, email: req.body.email };

    // Remove undefined fields
    Object.keys(allowedFields).forEach(
      (key) => allowedFields[key] === undefined && delete allowedFields[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, allowedFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
