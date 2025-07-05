import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [5000, 'Message content cannot exceed 5000 characters']
  },
  type: {
    type: String,
    enum: ['direct', 'course_announcement', 'system', 'support'],
    default: 'direct'
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  readAt: {
    type: Date
  },
  scheduledFor: {
    type: Date
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });
messageSchema.index({ type: 1 });
messageSchema.index({ course: 1 });
messageSchema.index({ threadId: 1 });
messageSchema.index({ scheduledFor: 1 });

// Virtual for message status
messageSchema.virtual('status').get(function() {
  if (this.isArchived) return 'archived';
  if (this.isRead) return 'read';
  return 'unread';
});

// Method to mark as read
messageSchema.methods.markAsRead = function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to archive message
messageSchema.methods.archive = function() {
  this.isArchived = true;
  return this.save();
};

// Method to unarchive message
messageSchema.methods.unarchive = function() {
  this.isArchived = false;
  return this.save();
};

// Method to toggle importance
messageSchema.methods.toggleImportance = function() {
  this.isImportant = !this.isImportant;
  return this.save();
};

// Static method to get user's inbox
messageSchema.statics.getInbox = function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ 
    recipient: userId, 
    isArchived: false 
  })
    .populate('sender', 'firstName lastName avatar email')
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get user's sent messages
messageSchema.statics.getSentMessages = function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ sender: userId })
    .populate('recipient', 'firstName lastName avatar email')
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get archived messages
messageSchema.statics.getArchivedMessages = function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ 
    recipient: userId, 
    isArchived: true 
  })
    .populate('sender', 'firstName lastName avatar email')
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get conversation thread
messageSchema.statics.getConversation = function(userId1, userId2, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  return this.find({
    $or: [
      { sender: userId1, recipient: userId2 },
      { sender: userId2, recipient: userId1 }
    ],
    type: 'direct'
  })
    .populate('sender', 'firstName lastName avatar')
    .populate('recipient', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get course announcements
messageSchema.statics.getCourseAnnouncements = function(courseId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ 
    course: courseId, 
    type: 'course_announcement' 
  })
    .populate('sender', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get unread count
messageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ 
    recipient: userId, 
    isRead: false, 
    isArchived: false 
  });
};

// Static method to mark conversation as read
messageSchema.statics.markConversationAsRead = function(userId1, userId2) {
  return this.updateMany(
    {
      sender: userId2,
      recipient: userId1,
      isRead: false
    },
    {
      isRead: true,
      readAt: new Date()
    }
  );
};

const Message = mongoose.model('Message', messageSchema);

export default Message; 