import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getStudents: () => api.get('/users/students'),
  getTeachers: () => api.get('/users/teachers'),
};

// Courses API
export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (courseData) => api.post('/courses', courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: (id) => api.delete(`/courses/${id}`),
  getByTeacher: (teacherId) => api.get(`/courses/teacher/${teacherId}`),
  getEnrolled: () => api.get('/courses/enrolled'),
  search: (query) => api.get(`/courses/search?q=${query}`),
};

// Enrollments API
export const enrollmentsAPI = {
  getAll: (params) => api.get('/enrollments', { params }),
  getById: (id) => api.get(`/enrollments/${id}`),
  create: (enrollmentData) => api.post('/enrollments', enrollmentData),
  update: (id, enrollmentData) => api.put(`/enrollments/${id}`, enrollmentData),
  delete: (id) => api.delete(`/enrollments/${id}`),
  getByStudent: (studentId) => api.get(`/enrollments/student/${studentId}`),
  getByCourse: (courseId) => api.get(`/enrollments/course/${courseId}`),
  enroll: (courseId) => api.post(`/enrollments/enroll/${courseId}`),
  unenroll: (courseId) => api.delete(`/enrollments/unenroll/${courseId}`),
};

// Quizzes API
export const quizzesAPI = {
  getAll: (params) => api.get('/quizzes', { params }),
  getById: (id) => api.get(`/quizzes/${id}`),
  create: (quizData) => api.post('/quizzes', quizData),
  update: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  delete: (id) => api.delete(`/quizzes/${id}`),
  getByCourse: (courseId) => api.get(`/quizzes/course/${courseId}`),
  submit: (id, answers) => api.post(`/quizzes/${id}/submit`, answers),
  getResults: (id) => api.get(`/quizzes/${id}/results`),
  getStudentResults: () => api.get('/quizzes/results'),
};

// Messages API
export const messagesAPI = {
  getInbox: () => api.get('/messages/inbox'),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  getCourseMessages: (courseId) => api.get(`/messages/course/${courseId}`),
  send: (messageData) => api.post('/messages', messageData),
  markAsRead: (messageId) => api.patch(`/messages/${messageId}/read`),
  delete: (messageId) => api.delete(`/messages/${messageId}`),
  getUnreadCount: () => api.get('/messages/unread/count'),
  getUsers: () => api.get('/messages/users'),
};

// File upload helper
export const uploadFile = async (file, type = 'general') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export default api; 