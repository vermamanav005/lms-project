import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Course title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Course description cannot exceed 1000 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    enum: ['Programming', 'Design', 'Business', 'Marketing', 'Science', 'Mathematics', 'Language', 'Music', 'Other']
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  duration: {
    type: Number, // in hours
    required: [true, 'Course duration is required'],
    min: [1, 'Course duration must be at least 1 hour']
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Course price cannot be negative']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  maxStudents: {
    type: Number,
    default: 100
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  prerequisites: [{
    type: String
  }],
  learningObjectives: [{
    type: String
  }],
  syllabus: [{
    week: Number,
    title: String,
    description: String,
    topics: [String],
    duration: Number // in hours
  }],
  materials: [{
    title: String,
    type: {
      type: String,
      enum: ['video', 'document', 'link', 'quiz']
    },
    url: String,
    description: String,
    duration: Number // for videos
  }],
  tags: [{
    type: String
  }],
  language: {
    type: String,
    default: 'English'
  },
  certificate: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Virtual for enrollment percentage
courseSchema.virtual('enrollmentPercentage').get(function() {
  return this.maxStudents > 0 ? (this.enrollmentCount / this.maxStudents) * 100 : 0;
});

// Virtual for course status
courseSchema.virtual('isFull').get(function() {
  return this.enrollmentCount >= this.maxStudents;
});

// Indexes for better query performance
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ isFeatured: 1 });
courseSchema.index({ 'rating.average': -1 });
courseSchema.index({ enrollmentCount: -1 });
courseSchema.index({ createdAt: -1 });

// Method to update rating
courseSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

// Method to increment enrollment count
courseSchema.methods.incrementEnrollment = function() {
  this.enrollmentCount += 1;
  return this.save();
};

// Method to decrement enrollment count
courseSchema.methods.decrementEnrollment = function() {
  if (this.enrollmentCount > 0) {
    this.enrollmentCount -= 1;
  }
  return this.save();
};

// Static method to get featured courses
courseSchema.statics.getFeaturedCourses = function(limit = 6) {
  return this.find({ isPublished: true, isFeatured: true })
    .populate('instructor', 'firstName lastName avatar')
    .sort({ 'rating.average': -1, enrollmentCount: -1 })
    .limit(limit);
};

// Static method to get courses by category
courseSchema.statics.getCoursesByCategory = function(category, limit = 10) {
  return this.find({ category, isPublished: true })
    .populate('instructor', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .limit(limit);
};

const Course = mongoose.model('Course', courseSchema);

export default Course; 