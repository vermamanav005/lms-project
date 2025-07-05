import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer', 'essay'],
    default: 'multiple_choice'
  },
  options: [{
    text: String,
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  correctAnswer: {
    type: String,
    required: function() {
      return this.type === 'short_answer' || this.type === 'essay';
    }
  },
  points: {
    type: Number,
    default: 1,
    min: [1, 'Points must be at least 1']
  },
  explanation: {
    type: String,
    maxlength: [500, 'Explanation cannot exceed 500 characters']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [100, 'Quiz title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Quiz description cannot exceed 500 characters']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  questions: [questionSchema],
  totalPoints: {
    type: Number,
    default: 0
  },
  timeLimit: {
    type: Number, // in minutes
    default: 30,
    min: [1, 'Time limit must be at least 1 minute']
  },
  passingScore: {
    type: Number,
    default: 70,
    min: [0, 'Passing score cannot be negative'],
    max: [100, 'Passing score cannot exceed 100']
  },
  maxAttempts: {
    type: Number,
    default: 3,
    min: [1, 'Max attempts must be at least 1']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isRandomized: {
    type: Boolean,
    default: false
  },
  showResults: {
    type: Boolean,
    default: true
  },
  showCorrectAnswers: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  category: {
    type: String,
    enum: ['practice', 'midterm', 'final', 'assignment'],
    default: 'practice'
  },
  tags: [{
    type: String
  }],
  instructions: {
    type: String,
    maxlength: [1000, 'Instructions cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Virtual for total questions count
quizSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

// Virtual for quiz status
quizSchema.virtual('status').get(function() {
  const now = new Date();
  if (this.startDate && now < this.startDate) {
    return 'scheduled';
  } else if (this.endDate && now > this.endDate) {
    return 'expired';
  } else {
    return 'active';
  }
});

// Virtual for average score
quizSchema.virtual('averageScore').get(function() {
  // This would be calculated from quiz attempts
  return 0;
});

// Indexes for better query performance
quizSchema.index({ course: 1 });
quizSchema.index({ instructor: 1 });
quizSchema.index({ isActive: 1 });
quizSchema.index({ category: 1 });
quizSchema.index({ startDate: 1 });
quizSchema.index({ endDate: 1 });
quizSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate total points
quizSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((total, question) => total + question.points, 0);
  next();
});

// Method to calculate score
quizSchema.methods.calculateScore = function(answers) {
  let totalScore = 0;
  let earnedPoints = 0;

  this.questions.forEach((question, index) => {
    const answer = answers[index];
    totalScore += question.points;

    if (question.type === 'multiple_choice') {
      const selectedOption = question.options[answer];
      if (selectedOption && selectedOption.isCorrect) {
        earnedPoints += question.points;
      }
    } else if (question.type === 'true_false') {
      const correctAnswer = question.options.find(option => option.isCorrect);
      if (correctAnswer && answer === question.options.indexOf(correctAnswer)) {
        earnedPoints += question.points;
      }
    } else if (question.type === 'short_answer' || question.type === 'essay') {
      // For text answers, you might want to implement manual grading
      // For now, we'll do simple text matching
      if (answer && answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
        earnedPoints += question.points;
      }
    }
  });

  return {
    score: totalScore > 0 ? Math.round((earnedPoints / totalScore) * 100) : 0,
    earnedPoints,
    totalPoints
  };
};

// Method to check if student can take quiz
quizSchema.methods.canTakeQuiz = function(studentId, attempts) {
  if (!this.isActive) return { canTake: false, reason: 'Quiz is not active' };
  
  const now = new Date();
  if (this.startDate && now < this.startDate) {
    return { canTake: false, reason: 'Quiz has not started yet' };
  }
  
  if (this.endDate && now > this.endDate) {
    return { canTake: false, reason: 'Quiz has expired' };
  }
  
  if (attempts >= this.maxAttempts) {
    return { canTake: false, reason: 'Maximum attempts reached' };
  }
  
  return { canTake: true };
};

// Static method to get quizzes by course
quizSchema.statics.getQuizzesByCourse = function(courseId) {
  return this.find({ course: courseId, isActive: true })
    .populate('instructor', 'firstName lastName')
    .sort({ createdAt: -1 });
};

// Static method to get active quizzes
quizSchema.statics.getActiveQuizzes = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    $or: [
      { startDate: { $lte: now } },
      { startDate: { $exists: false } }
    ],
    $or: [
      { endDate: { $gte: now } },
      { endDate: { $exists: false } }
    ]
  }).populate('course', 'title').populate('instructor', 'firstName lastName');
};

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz; 