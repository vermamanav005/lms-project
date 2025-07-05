import express from 'express';
import { body, validationResult, query } from 'express-validator';
import User from '../models/User.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', [
  authenticateToken,
  authorizeRoles('Admin'),
  query('role').optional().isIn(['Student', 'Teacher', 'Admin']),
  query('isActive').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { role, isActive, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Only allow users to view their own profile or admins to view any profile
  if (req.user.role !== 'Admin' && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.json({
    success: true,
    data: { user }
  });
}));

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private/Admin
router.put('/:id', [
  authenticateToken,
  authorizeRoles('Admin'),
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['Student', 'Teacher', 'Admin']),
  body('isActive').optional().isBoolean(),
  body('specialization').optional().isLength({ max: 100 }),
  body('experience').optional().isInt({ min: 0 }),
  body('grade').optional().isString()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const {
    firstName,
    lastName,
    email,
    role,
    isActive,
    specialization,
    experience,
    grade,
    bio,
    phone
  } = req.body;

  // Check if email is already taken by another user
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already taken'
      });
    }
    user.email = email;
  }

  // Update fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (specialization !== undefined) user.specialization = specialization;
  if (experience !== undefined) user.experience = experience;
  if (grade !== undefined) user.grade = grade;
  if (bio !== undefined) user.bio = bio;
  if (phone !== undefined) user.phone = phone;

  await user.save();

  res.json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: user.getPublicProfile()
    }
  });
}));

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/:id', [
  authenticateToken,
  authorizeRoles('Admin')
], asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete your own account'
    });
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
}));

// @route   GET /api/users/teachers
// @desc    Get all teachers
// @access  Public
router.get('/teachers', asyncHandler(async (req, res) => {
  const teachers = await User.find({ 
    role: 'Teacher', 
    isActive: true 
  })
    .select('firstName lastName avatar specialization experience bio')
    .sort({ firstName: 1 });

  res.json({
    success: true,
    data: { teachers }
  });
}));

// @route   GET /api/users/students
// @desc    Get all students (Admin/Teacher only)
// @access  Private
router.get('/students', [
  authenticateToken,
  authorizeRoles('Admin', 'Teacher')
], asyncHandler(async (req, res) => {
  const students = await User.find({ 
    role: 'Student', 
    isActive: true 
  })
    .select('firstName lastName email avatar grade enrollmentDate')
    .sort({ firstName: 1 });

  res.json({
    success: true,
    data: { students }
  });
}));

// @route   GET /api/users/stats
// @desc    Get user statistics (Admin only)
// @access  Private/Admin
router.get('/stats', [
  authenticateToken,
  authorizeRoles('Admin')
], asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const students = await User.countDocuments({ role: 'Student' });
  const teachers = await User.countDocuments({ role: 'Teacher' });
  const admins = await User.countDocuments({ role: 'Admin' });

  // Get recent registrations
  const recentRegistrations = await User.find()
    .select('firstName lastName role createdAt')
    .sort({ createdAt: -1 })
    .limit(10);

  // Get users by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyStats = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      students,
      teachers,
      admins,
      recentRegistrations,
      monthlyStats
    }
  });
}));

// @route   POST /api/users/bulk-action
// @desc    Perform bulk actions on users (Admin only)
// @access  Private/Admin
router.post('/bulk-action', [
  authenticateToken,
  authorizeRoles('Admin'),
  body('action').isIn(['activate', 'deactivate', 'delete', 'changeRole']),
  body('userIds').isArray({ min: 1 }),
  body('userIds.*').isMongoId(),
  body('role').optional().isIn(['Student', 'Teacher', 'Admin'])
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { action, userIds, role } = req.body;

  let updateData = {};
  let message = '';

  switch (action) {
    case 'activate':
      updateData = { isActive: true };
      message = 'Users activated successfully';
      break;
    case 'deactivate':
      updateData = { isActive: false };
      message = 'Users deactivated successfully';
      break;
    case 'changeRole':
      if (!role) {
        return res.status(400).json({
          success: false,
          message: 'Role is required for changeRole action'
        });
      }
      updateData = { role };
      message = 'User roles updated successfully';
      break;
    case 'delete':
      await User.deleteMany({ _id: { $in: userIds } });
      return res.json({
        success: true,
        message: 'Users deleted successfully'
      });
  }

  const result = await User.updateMany(
    { _id: { $in: userIds } },
    updateData
  );

  res.json({
    success: true,
    message,
    data: {
      modifiedCount: result.modifiedCount
    }
  });
}));

export default router; 