import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Course from '../models/Course.js';
import { authenticateToken, authorizeRoles, authorizeInstructor } from '../middleware/auth.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses with filters
// @access  Public
router.get('/', [
  query('category').optional().isString(),
  query('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced']),
  query('instructor').optional().isMongoId(),
  query('isPublished').optional().isBoolean(),
  query('isFeatured').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('sort').optional().isIn(['newest', 'oldest', 'rating', 'enrollment', 'price'])
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const {
    category,
    level,
    instructor,
    isPublished,
    isFeatured,
    page = 1,
    limit = 12,
    sort = 'newest'
  } = req.query;

  const skip = (page - 1) * limit;

  // Build filter
  const filter = {};
  if (category) filter.category = category;
  if (level) filter.level = level;
  if (instructor) filter.instructor = instructor;
  if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

  // Build sort
  let sortOption = {};
  switch (sort) {
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'rating':
      sortOption = { 'rating.average': -1 };
      break;
    case 'enrollment':
      sortOption = { enrollmentCount: -1 };
      break;
    case 'price':
      sortOption = { price: 1 };
      break;
  }

  const courses = await Course.find(filter)
    .populate('instructor', 'firstName lastName avatar specialization')
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Course.countDocuments(filter);

  res.json({
    success: true,
    data: {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @route   GET /api/courses/featured
// @desc    Get featured courses
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const courses = await Course.getFeaturedCourses(6);

  res.json({
    success: true,
    data: { courses }
  });
}));

// @route   GET /api/courses/categories
// @desc    Get courses by category
// @access  Public
router.get('/categories/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { limit = 10 } = req.query;

  const courses = await Course.getCoursesByCategory(category, parseInt(limit));

  res.json({
    success: true,
    data: { courses }
  });
}));

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'firstName lastName avatar bio specialization experience');

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  res.json({
    success: true,
    data: { course }
  });
}));

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private/Teacher,Admin
router.post('/', [
  authenticateToken,
  authorizeRoles('Teacher', 'Admin'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  body('category')
    .isIn(['Programming', 'Design', 'Business', 'Marketing', 'Science', 'Mathematics', 'Language', 'Music', 'Other'])
    .withMessage('Invalid category'),
  body('level')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Invalid level'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 hour'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be non-negative'),
  body('maxStudents')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max students must be at least 1'),
  body('prerequisites')
    .optional()
    .isArray()
    .withMessage('Prerequisites must be an array'),
  body('learningObjectives')
    .optional()
    .isArray()
    .withMessage('Learning objectives must be an array'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const {
    title,
    description,
    category,
    level,
    duration,
    price,
    maxStudents = 100,
    prerequisites = [],
    learningObjectives = [],
    tags = [],
    syllabus = [],
    materials = []
  } = req.body;

  const course = new Course({
    title,
    description,
    instructor: req.user._id,
    category,
    level,
    duration,
    price,
    maxStudents,
    prerequisites,
    learningObjectives,
    tags,
    syllabus,
    materials
  });

  await course.save();

  const populatedCourse = await Course.findById(course._id)
    .populate('instructor', 'firstName lastName avatar');

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: { course: populatedCourse }
  });
}));

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private/Instructor,Admin
router.put('/:id', [
  authenticateToken,
  authorizeInstructor,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  body('category')
    .optional()
    .isIn(['Programming', 'Design', 'Business', 'Marketing', 'Science', 'Mathematics', 'Language', 'Music', 'Other'])
    .withMessage('Invalid category'),
  body('level')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Invalid level'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 hour'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be non-negative'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  const updateFields = [
    'title', 'description', 'category', 'level', 'duration', 'price',
    'maxStudents', 'prerequisites', 'learningObjectives', 'tags',
    'syllabus', 'materials', 'isPublished', 'isFeatured', 'thumbnail',
    'startDate', 'endDate', 'language', 'certificate', 'status'
  ];

  updateFields.forEach(field => {
    if (req.body[field] !== undefined) {
      course[field] = req.body[field];
    }
  });

  await course.save();

  const updatedCourse = await Course.findById(course._id)
    .populate('instructor', 'firstName lastName avatar');

  res.json({
    success: true,
    message: 'Course updated successfully',
    data: { course: updatedCourse }
  });
}));

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private/Instructor,Admin
router.delete('/:id', [
  authenticateToken,
  authorizeInstructor
], asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  await Course.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Course deleted successfully'
  });
}));

// @route   POST /api/courses/:id/rate
// @desc    Rate a course
// @access  Private
router.post('/:id/rate', [
  authenticateToken,
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { rating } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  await course.updateRating(rating);

  res.json({
    success: true,
    message: 'Course rated successfully',
    data: {
      rating: course.rating
    }
  });
}));

// @route   GET /api/courses/instructor/:instructorId
// @desc    Get courses by instructor
// @access  Public
router.get('/instructor/:instructorId', asyncHandler(async (req, res) => {
  const { instructorId } = req.params;
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  const courses = await Course.find({ instructor: instructorId, isPublished: true })
    .populate('instructor', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Course.countDocuments({ instructor: instructorId, isPublished: true });

  res.json({
    success: true,
    data: {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @route   GET /api/courses/search
// @desc    Search courses
// @access  Public
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
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

  const { q, page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  const searchRegex = new RegExp(q, 'i');

  const courses = await Course.find({
    $and: [
      { isPublished: true },
      {
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
          { category: searchRegex }
        ]
      }
    ]
  })
    .populate('instructor', 'firstName lastName avatar')
    .sort({ 'rating.average': -1, enrollmentCount: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Course.countDocuments({
    $and: [
      { isPublished: true },
      {
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
          { category: searchRegex }
        ]
      }
    ]
  });

  res.json({
    success: true,
    data: {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

export default router; 