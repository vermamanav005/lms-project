import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped', 'suspended'],
    default: 'active'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'Incomplete'],
    default: 'Incomplete'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  completedLessons: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignments: [{
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId
    },
    submittedAt: {
      type: Date
    },
    grade: {
      type: Number,
      min: 0,
      max: 100
    },
    feedback: String
  }],
  quizzes: [{
    quizId: {
      type: mongoose.Schema.Types.ObjectId
    },
    attemptedAt: {
      type: Date
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    attempts: {
      type: Number,
      default: 1
    }
  }],
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: {
      type: Date
    },
    certificateId: {
      type: String
    }
  },
  notes: [{
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  payment: {
    amount: {
      type: Number,
      required: [true, 'Payment amount is required']
    },
    method: {
      type: String,
      enum: ['credit_card', 'paypal', 'bank_transfer', 'scholarship'],
      required: [true, 'Payment method is required']
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Compound index to ensure unique student-course combination
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Indexes for better query performance
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1, status: 1 });
enrollmentSchema.index({ enrollmentDate: -1 });
enrollmentSchema.index({ completionDate: -1 });
enrollmentSchema.index({ progress: -1 });

// Virtual for enrollment duration
enrollmentSchema.virtual('duration').get(function() {
  if (this.completionDate) {
    return Math.ceil((this.completionDate - this.enrollmentDate) / (1000 * 60 * 60 * 24));
  }
  return Math.ceil((Date.now() - this.enrollmentDate) / (1000 * 60 * 60 * 24));
});

// Virtual for is completed
enrollmentSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed' || this.progress === 100;
});

// Method to update progress
enrollmentSchema.methods.updateProgress = function(progress) {
  this.progress = Math.min(100, Math.max(0, progress));
  this.lastAccessed = new Date();
  
  if (this.progress === 100 && this.status === 'active') {
    this.status = 'completed';
    this.completionDate = new Date();
  }
  
  return this.save();
};

// Method to complete a lesson
enrollmentSchema.methods.completeLesson = function(lessonId) {
  const existingLesson = this.completedLessons.find(lesson => 
    lesson.lessonId.toString() === lessonId.toString()
  );
  
  if (!existingLesson) {
    this.completedLessons.push({ lessonId });
  }
  
  return this.save();
};

// Method to submit assignment
enrollmentSchema.methods.submitAssignment = function(assignmentId) {
  const existingAssignment = this.assignments.find(assignment => 
    assignment.assignmentId.toString() === assignmentId.toString()
  );
  
  if (!existingAssignment) {
    this.assignments.push({ 
      assignmentId, 
      submittedAt: new Date() 
    });
  }
  
  return this.save();
};

// Method to take quiz
enrollmentSchema.methods.takeQuiz = function(quizId, score) {
  const existingQuiz = this.quizzes.find(quiz => 
    quiz.quizId.toString() === quizId.toString()
  );
  
  if (existingQuiz) {
    existingQuiz.attempts += 1;
    existingQuiz.score = Math.max(existingQuiz.score, score);
    existingQuiz.attemptedAt = new Date();
  } else {
    this.quizzes.push({
      quizId,
      attemptedAt: new Date(),
      score,
      attempts: 1
    });
  }
  
  return this.save();
};

// Static method to get student enrollments
enrollmentSchema.statics.getStudentEnrollments = function(studentId) {
  return this.find({ student: studentId })
    .populate('course', 'title description thumbnail instructor category level duration price')
    .populate('course.instructor', 'firstName lastName avatar')
    .sort({ enrollmentDate: -1 });
};

// Static method to get course enrollments
enrollmentSchema.statics.getCourseEnrollments = function(courseId) {
  return this.find({ course: courseId })
    .populate('student', 'firstName lastName email avatar')
    .sort({ enrollmentDate: -1 });
};

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment; 