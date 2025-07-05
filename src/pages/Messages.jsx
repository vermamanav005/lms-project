import { useState, useEffect } from 'react';
import { 
  EnvelopeIcon, 
  PaperAirplaneIcon, 
  TrashIcon, 
  UserIcon,
  BookOpenIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { messagesAPI, usersAPI } from '../services/api';
import toast from 'react-hot-toast';

function Messages({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({
    recipientId: '',
    subject: '',
    content: '',
    messageType: 'personal'
  });
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadMessages();
    loadUsers();
    loadUnreadCount();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await messagesAPI.getInbox();
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await messagesAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await messagesAPI.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const loadConversation = async (userId) => {
    try {
      const response = await messagesAPI.getConversation(userId);
      setConversation(response.data);
      setSelectedUser(users.find(u => u._id === userId));
    } catch (error) {
      toast.error('Failed to load conversation');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await messagesAPI.send(composeData);
      toast.success('Message sent successfully');
      setShowCompose(false);
      setComposeData({ recipientId: '', subject: '', content: '', messageType: 'personal' });
      loadMessages();
      if (selectedUser) {
        loadConversation(selectedUser._id);
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await messagesAPI.markAsRead(messageId);
      setMessages(messages.map(msg => 
        msg._id === messageId ? { ...msg, isRead: true } : msg
      ));
      loadUnreadCount();
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await messagesAPI.delete(messageId);
      toast.success('Message deleted successfully');
      setMessages(messages.filter(msg => msg._id !== messageId));
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageIcon = (messageType) => {
    switch (messageType) {
      case 'announcement':
        return <BellIcon className="h-5 w-5 text-orange-500" />;
      case 'course':
        return <BookOpenIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <EnvelopeIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
          </p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="inline-flex items-center bg-violet-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-violet-600 transition-colors duration-300"
        >
          <PaperAirplaneIcon className="h-5 w-5 mr-2" />
          Compose
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Inbox</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No messages yet
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.isRead && message.recipient._id === currentUser?._id) {
                        handleMarkAsRead(message._id);
                      }
                    }}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                      !message.isRead && message.recipient._id === currentUser?._id
                        ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                        : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getMessageIcon(message.messageType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            !message.isRead && message.recipient._id === currentUser?._id
                              ? 'text-gray-900'
                              : 'text-gray-700'
                          }`}>
                            {message.sender.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {message.subject}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {message.content.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            {selectedMessage ? (
              <div>
                <div className="p-4 border-b border-gray-200 flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>From: {selectedMessage.sender.name}</span>
                      <span>To: {selectedMessage.recipient.name}</span>
                      <span>{formatDate(selectedMessage.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedMessage.content}
                    </p>
                  </div>
                  {selectedMessage.course && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600">
                        Related to course: <span className="font-medium">{selectedMessage.course.title}</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setComposeData({
                        recipientId: selectedMessage.sender._id,
                        subject: `Re: ${selectedMessage.subject}`,
                        content: '',
                        messageType: 'personal'
                      });
                      setShowCompose(true);
                    }}
                    className="inline-flex items-center bg-violet-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-violet-600 transition-colors duration-300"
                  >
                    <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                    Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <EnvelopeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a message to view its content</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Compose Message</h2>
            </div>
            <form onSubmit={handleSendMessage} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <select
                    value={composeData.recipientId}
                    onChange={(e) => setComposeData({...composeData, recipientId: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  >
                    <option value="">Select recipient</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={composeData.subject}
                    onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message Type
                  </label>
                  <select
                    value={composeData.messageType}
                    onChange={(e) => setComposeData({...composeData, messageType: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="personal">Personal Message</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={composeData.content}
                    onChange={(e) => setComposeData({...composeData, content: e.target.value})}
                    rows={6}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages; 