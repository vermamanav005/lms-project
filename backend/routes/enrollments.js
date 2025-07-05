import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// @route   POST /api/enrollments
// @desc    Enroll in a course
// @access  Private
router.post('/', [
  authenticateToken,
  body('courseId')
    .isMongoId()
    .withMessage('Valid course ID is required'),
  body('paymentMethod')
    .isIn(['credit_card', 'paypal', 'bank_transfer', 'scholarship'])
    .withMessage('Valid payment method is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { courseId, paymentMethod } = req.body;

  // Check if course exists and is published
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  if (!course.isPublished) {
    return res.status(400).json({
      success: false,
      message: 'Course is not available for enrollment'
    });
  }

  // Check if course is full
  if (course.isFull) {
    return res.status(400).json({
      success: false,
      message: 'Course is full'
    });
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId
  });

  if (existingEnrollment) {
    return res.status(400).json({
      success: false,
      message: 'Already enrolled in this course'
    });
  }

  // Create enrollment
  const enrollment = new Enrollment({
    student: req.user._id,
    course: courseId,
    payment: {
      amount: course.price,
      method: paymentMethod,
      status: 'completed', // In a real app, this would be 'pending' until payment is confirmed
      paidAt: new Date()
    }
  });

  await enrollment.save();

  // Increment course enrollment count
  await course.incrementEnrollment();

  const populatedEnrollment = await Enrollment.findById(enrollment._id)
    .populate('course', 'title description thumbnail instructor')
    .populate('course.instructor', 'firstName lastName');

  res.status(201).json({
    success: true,
    message: 'Successfully enrolled in course',
    data: { enrollment: populatedEnrollment }
  });
}));

// @route   GET /api/enrollments
// @desc    Get user's enrollments
// @access  Private
router.get('/', [
  authenticateToken,
  query('status').optional().isIn(['active', 'completed', 'dropped', 'suspended']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { status, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const filter = { student: req.user._id };
  if (status) filter.status = status;

  const enrollments = await Enrollment.find(filter)
    .populate('course', 'title description thumbnail instructor category level duration')
    .populate('course.instructor', 'firstName lastName avatar')
    .sort({ enrollmentDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Enrollment.countDocuments(filter);

  res.json({
    success: true,
    data: {
      enrollments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @route   GET /api/enrollments/:id
// @desc    Get enrollment by ID
// @access  Private
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id)
    .populate('course', 'title description thumbnail instructor syllabus materials')
    .populate('course.instructor', 'firstName lastName avatar bio')
    .populate('student', 'firstName lastName email avatar');

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  // Check if user can access this enrollment
  if (req.user.role !== 'Admin' && 
      enrollment.student._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.json({
    success: true,
    data: { enrollment }
  });
}));

// @route   PUT /api/enrollments/:id/progress
// @desc    Update enrollment progress
// @access  Private
router.put('/:id/progress', [
  authenticateToken,
  body('progress')
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { progress } = req.body;
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  // Check if user can update this enrollment
  if (enrollment.student.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  await enrollment.updateProgress(progress);

  res.json({
    success: true,
    message: 'Progress updated successfully',
    data: { enrollment }
  });
}));

// @route   PUT /api/enrollments/:id/complete-lesson
// @desc    Mark lesson as completed
// @access  Private
router.put('/:id/complete-lesson', [
  authenticateToken,
  body('lessonId')
    .isMongoId()
    .withMessage('Valid lesson ID is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { lessonId } = req.body;
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  // Check if user can update this enrollment
  if (enrollment.student.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  await enrollment.completeLesson(lessonId);

  res.json({
    success: true,
    message: 'Lesson marked as completed',
    data: { enrollment }
  });
}));

// @route   DELETE /api/enrollments/:id
// @desc    Drop course enrollment
// @access  Private
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  // Check if user can drop this enrollment
  if (enrollment.student.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Update enrollment status
  enrollment.status = 'dropped';
  await enrollment.save();

  // Decrement course enrollment count
  const course = await Course.findById(enrollment.course);
  if (course) {
    await course.decrementEnrollment();
  }

  res.json({
    success: true,
    message: 'Successfully dropped course'
  });
}));

// @route   GET /api/enrollments/course/:courseId
// @desc    Get enrollments for a course (Instructor/Admin only)
// @access  Private
router.get('/course/:courseId', [
  authenticateToken,
  authorizeRoles('Teacher', 'Admin'),
  query('status').optional().isIn(['active', 'completed', 'dropped', 'suspended']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { courseId } = req.params;
  const { status, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  // Check if user is the course instructor or admin
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  if (req.user.role !== 'Admin' && course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  const filter = { course: courseId };
  if (status) filter.status = status;

  const enrollments = await Enrollment.find(filter)
    .populate('student', 'firstName lastName email avatar grade')
    .sort({ enrollmentDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Enrollment.countDocuments(filter);

  res.json({
    success: true,
    data: {
      enrollments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @route   PUT /api/enrollments/:id/grade
// @desc    Grade student enrollment (Instructor/Admin only)
// @access  Private
router.put('/:id/grade', [
  authenticateToken,
  authorizeRoles('Teacher', 'Admin'),
  body('grade')
    .isIn(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'Incomplete'])
    .withMessage('Valid grade is required'),
  body('score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { grade, score } = req.body;
  const enrollment = await Enrollment.findById(req.params.id)
    .populate('course', 'instructor');

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  // Check if user is the course instructor or admin
  if (req.user.role !== 'Admin' && 
      enrollment.course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  enrollment.grade = grade;
  if (score !== undefined) enrollment.score = score;
  await enrollment.save();

  res.json({
    success: true,
    message: 'Grade updated successfully',
    data: { enrollment }
  });
}));

// @route   GET /api/enrollments/stats
// @desc    Get enrollment statistics
// @access  Private
router.get('/stats', authenticateToken, asyncHandler(async (req, res) => {
  const stats = await Enrollment.aggregate([
    {
      $match: { student: req.user._id }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalEnrollments = await Enrollment.countDocuments({ student: req.user._id });
  const activeEnrollments = await Enrollment.countDocuments({ 
    student: req.user._id, 
    status: 'active' 
  });
  const completedEnrollments = await Enrollment.countDocuments({ 
    student: req.user._id, 
    status: 'completed' 
  });

  // Calculate average progress
  const progressStats = await Enrollment.aggregate([
    {
      $match: { student: req.user._id, status: 'active' }
    },
    {
      $group: {
        _id: null,
        averageProgress: { $avg: '$progress' }
      }
    }
  ]);

  const averageProgress = progressStats.length > 0 ? progressStats[0].averageProgress : 0;

  res.json({
    success: true,
    data: {
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      averageProgress: Math.round(averageProgress),
      statusBreakdown: stats
    }
  });
}));

export default router; 