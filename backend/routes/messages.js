import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// Get all messages for a user (inbox)
router.get('/inbox', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ 
      $or: [
        { recipient: req.user.id },
        { sender: req.user.id }
      ]
    })
    .populate('sender', 'name email role')
    .populate('recipient', 'name email role')
    .populate('course', 'title')
    .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// Get messages between two users
router.get('/conversation/:userId', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user.id }
      ]
    })
    .populate('sender', 'name email role')
    .populate('recipient', 'name email role')
    .populate('course', 'title')
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversation', error: error.message });
  }
});

// Get course-specific messages
router.get('/course/:courseId', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ 
      course: req.params.courseId,
      $or: [
        { recipient: req.user.id },
        { sender: req.user.id },
        { messageType: 'announcement' }
      ]
    })
    .populate('sender', 'name email role')
    .populate('recipient', 'name email role')
    .populate('course', 'title')
    .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course messages', error: error.message });
  }
});

// Send a new message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { recipientId, courseId, subject, content, messageType = 'personal' } = req.body;

    // Validate recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Check permissions based on message type
    if (messageType === 'announcement' && req.user.role !== 'Teacher' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only teachers and admins can send announcements' });
    }

    const message = new Message({
      sender: req.user.id,
      recipient: recipientId,
      course: courseId,
      subject,
      content,
      messageType
    });

    await message.save();

    // Populate sender and recipient info
    await message.populate('sender', 'name email role');
    await message.populate('recipient', 'name email role');
    if (courseId) {
      await message.populate('course', 'title');
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Mark message as read
router.patch('/:messageId/read', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only recipient can mark as read
    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to mark this message as read' });
    }

    message.isRead = true;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error updating message', error: error.message });
  }
});

// Delete a message
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete their own messages
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await Message.findByIdAndDelete(req.params.messageId);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
});

// Get unread message count
router.get('/unread/count', authenticateToken, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
});

// Get users for messaging (filtered by role and permissions)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    let query = {};
    
    // Students can only message teachers and admins
    if (req.user.role === 'Student') {
      query.role = { $in: ['Teacher', 'Admin'] };
    }
    // Teachers can message students, other teachers, and admins
    else if (req.user.role === 'Teacher') {
      query.role = { $in: ['Student', 'Teacher', 'Admin'] };
    }
    // Admins can message everyone
    // No query filter needed

    const users = await User.find(query)
      .select('name email role')
      .sort({ name: 1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

export default router; 