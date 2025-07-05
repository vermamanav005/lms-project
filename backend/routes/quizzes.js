import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Quiz from '../models/Quiz.js';
import Course from '../models/Course.js';
import { authenticateToken, authorizeRoles, authorizeInstructor } from '../middleware/auth.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// @route   POST /api/quizzes
// @desc    Create a new quiz
// @access  Private/Teacher,Admin
router.post('/', [
  authenticateToken,
  authorizeRoles('Teacher', 'Admin'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('courseId')
    .isMongoId()
    .withMessage('Valid course ID is required'),
  body('questions')
    .isArray({ min: 1 })
    .withMessage('At least one question is required'),
  body('questions.*.question')
    .trim()
    .notEmpty()
    .withMessage('Question text is required'),
  body('questions.*.type')
    .isIn(['multiple_choice', 'true_false', 'short_answer', 'essay'])
    .withMessage('Valid question type is required'),
  body('questions.*.points')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Points must be at least 1'),
  body('timeLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Time limit must be at least 1 minute'),
  body('passingScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Passing score must be between 0 and 100'),
  body('maxAttempts')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max attempts must be at least 1'),
  body('category')
    .optional()
    .isIn(['practice', 'midterm', 'final', 'assignment'])
    .withMessage('Valid category is required')
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
    courseId,
    questions,
    timeLimit = 30,
    passingScore = 70,
    maxAttempts = 3,
    category = 'practice',
    isRandomized = false,
    showResults = true,
    showCorrectAnswers = false,
    startDate,
    endDate,
    instructions,
    tags = []
  } = req.body;

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Check if user is the course instructor or admin
  if (req.user.role !== 'Admin' && course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only the course instructor can create quizzes.'
    });
  }

  // Validate questions
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    
    if (question.type === 'multiple_choice' || question.type === 'true_false') {
      if (!question.options || question.options.length < 2) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1}: Multiple choice and true/false questions must have at least 2 options`
        });
      }
      
      const correctOptions = question.options.filter(option => option.isCorrect);
      if (correctOptions.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1}: Must have at least one correct answer`
        });
      }
    } else if (question.type === 'short_answer' || question.type === 'essay') {
      if (!question.correctAnswer) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1}: Short answer and essay questions must have a correct answer`
        });
      }
    }
  }

  const quiz = new Quiz({
    title,
    description,
    course: courseId,
    instructor: req.user._id,
    questions,
    timeLimit,
    passingScore,
    maxAttempts,
    category,
    isRandomized,
    showResults,
    showCorrectAnswers,
    startDate,
    endDate,
    instructions,
    tags
  });

  await quiz.save();

  const populatedQuiz = await Quiz.findById(quiz._id)
    .populate('course', 'title')
    .populate('instructor', 'firstName lastName');

  res.status(201).json({
    success: true,
    message: 'Quiz created successfully',
    data: { quiz: populatedQuiz }
  });
}));

// @route   GET /api/quizzes
// @desc    Get quizzes with filters
// @access  Private
router.get('/', [
  authenticateToken,
  query('courseId').optional().isMongoId(),
  query('category').optional().isIn(['practice', 'midterm', 'final', 'assignment']),
  query('isActive').optional().isBoolean(),
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

  const { courseId, category, isActive, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (courseId) filter.course = courseId;
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  // If user is a student, only show active quizzes
  if (req.user.role === 'Student') {
    filter.isActive = true;
  }

  const quizzes = await Quiz.find(filter)
    .populate('course', 'title')
    .populate('instructor', 'firstName lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Quiz.countDocuments(filter);

  res.json({
    success: true,
    data: {
      quizzes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @route   GET /api/quizzes/:id
// @desc    Get quiz by ID
// @access  Private
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id)
    .populate('course', 'title description')
    .populate('instructor', 'firstName lastName');

  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: 'Quiz not found'
    });
  }

  // Check if user can access this quiz
  if (req.user.role === 'Student') {
    if (!quiz.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Quiz is not active'
      });
    }
  } else if (req.user.role !== 'Admin' && quiz.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.json({
    success: true,
    data: { quiz }
  });
}));

// @route   PUT /api/quizzes/:id
// @desc    Update quiz
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
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('timeLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Time limit must be at least 1 minute'),
  body('passingScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Passing score must be between 0 and 100'),
  body('maxAttempts')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max attempts must be at least 1')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: 'Quiz not found'
    });
  }

  // Check if user is the quiz instructor or admin
  if (req.user.role !== 'Admin' && quiz.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  const updateFields = [
    'title', 'description', 'timeLimit', 'passingScore', 'maxAttempts',
    'isActive', 'isRandomized', 'showResults', 'showCorrectAnswers',
    'startDate', 'endDate', 'instructions', 'tags'
  ];

  updateFields.forEach(field => {
    if (req.body[field] !== undefined) {
      quiz[field] = req.body[field];
    }
  });

  await quiz.save();

  const updatedQuiz = await Quiz.findById(quiz._id)
    .populate('course', 'title')
    .populate('instructor', 'firstName lastName');

  res.json({
    success: true,
    message: 'Quiz updated successfully',
    data: { quiz: updatedQuiz }
  });
}));

// @route   DELETE /api/quizzes/:id
// @desc    Delete quiz
// @access  Private/Instructor,Admin
router.delete('/:id', [
  authenticateToken,
  authorizeInstructor
], asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: 'Quiz not found'
    });
  }

  // Check if user is the quiz instructor or admin
  if (req.user.role !== 'Admin' && quiz.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  await Quiz.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Quiz deleted successfully'
  });
}));

// @route   POST /api/quizzes/:id/take
// @desc    Take a quiz
// @access  Private
router.post('/:id/take', [
  authenticateToken,
  body('answers')
    .isArray()
    .withMessage('Answers must be an array')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { answers } = req.body;
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: 'Quiz not found'
    });
  }

  if (!quiz.isActive) {
    return res.status(400).json({
      success: false,
      message: 'Quiz is not active'
    });
  }

  // Check if student can take the quiz
  const canTake = quiz.canTakeQuiz(req.user._id, 0); // You would need to track attempts
  if (!canTake.canTake) {
    return res.status(400).json({
      success: false,
      message: canTake.reason
    });
  }

  // Calculate score
  const result = quiz.calculateScore(answers);

  // In a real application, you would save the quiz attempt
  // For now, we'll just return the result

  res.json({
    success: true,
    message: 'Quiz completed successfully',
    data: {
      score: result.score,
      earnedPoints: result.earnedPoints,
      totalPoints: result.totalPoints,
      passed: result.score >= quiz.passingScore,
      showCorrectAnswers: quiz.showCorrectAnswers
    }
  });
}));

// @route   GET /api/quizzes/course/:courseId
// @desc    Get quizzes for a course
// @access  Private
router.get('/course/:courseId', [
  authenticateToken,
  query('category').optional().isIn(['practice', 'midterm', 'final', 'assignment']),
  query('isActive').optional().isBoolean()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { courseId } = req.params;
  const { category, isActive } = req.query;

  const filter = { course: courseId };
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  // If user is a student, only show active quizzes
  if (req.user.role === 'Student') {
    filter.isActive = true;
  }

  const quizzes = await Quiz.find(filter)
    .populate('instructor', 'firstName lastName')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: { quizzes }
  });
}));

// @route   GET /api/quizzes/stats
// @desc    Get quiz statistics (Instructor/Admin only)
// @access  Private
router.get('/stats', [
  authenticateToken,
  authorizeRoles('Teacher', 'Admin')
], asyncHandler(async (req, res) => {
  const { courseId } = req.query;

  const filter = {};
  if (courseId) filter.course = courseId;
  if (req.user.role === 'Teacher') filter.instructor = req.user._id;

  const totalQuizzes = await Quiz.countDocuments(filter);
  const activeQuizzes = await Quiz.countDocuments({ ...filter, isActive: true });
  const publishedQuizzes = await Quiz.countDocuments({ ...filter, isActive: true });

  // Get quizzes by category
  const categoryStats = await Quiz.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get recent quizzes
  const recentQuizzes = await Quiz.find(filter)
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      totalQuizzes,
      activeQuizzes,
      publishedQuizzes,
      categoryStats,
      recentQuizzes
    }
  });
}));

export default router; 