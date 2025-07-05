import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Authentication error' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

export const authorizeOwner = (model, field = 'userId') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const resource = await model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Allow admins to access any resource
      if (req.user.role === 'Admin') {
        return next();
      }

      // Check if user owns the resource
      if (resource[field].toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied. You can only access your own resources.' });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Authorization error' });
    }
  };
};

export const authorizeInstructor = async (req, res, next) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;
    
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    const Course = (await import('../models/Course.js')).default;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Allow admins to access any course
    if (req.user.role === 'Admin') {
      return next();
    }

    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Only the course instructor can perform this action.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Authorization error' });
  }
};

export const authorizeEnrollment = async (req, res, next) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;
    
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    const Enrollment = (await import('../models/Enrollment.js')).default;
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      status: { $in: ['active', 'completed'] }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Access denied. You must be enrolled in this course.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Authorization error' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}; 