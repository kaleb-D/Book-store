import User from '../models/UserModel.js';
import Book from '../models/bookModel.js';
import Contact from '../models/contactModel.js';

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalBooks, totalContacts, unreadContacts] =
      await Promise.all([
        User.countDocuments(),
        Book.countDocuments(),
        Contact.countDocuments(),
        Contact.countDocuments({ status: 'unread' }),
      ]);

    // Books by category
    const booksByCategory = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Total stock value
    const stockStats = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBooks,
        totalContacts,
        unreadContacts,
        recentRegistrations,
        booksByCategory,
        inventory: stockStats[0] || {
          totalStock: 0,
          totalValue: 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (admin)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single user by ID (admin)
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a user role (admin)
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be "user" or "admin".',
      });
    }

    // Prevent admin from demoting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot change your own role',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
