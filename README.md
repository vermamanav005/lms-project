# Learning Management System (LMS)

A comprehensive Learning Management System built with React frontend and Node.js backend, featuring role-based access control, real-time messaging, course management, and quiz systems.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** with secure token management
- **Role-based Access Control** (Admin, Teacher, Student)
- **Protected Routes** with automatic redirects
- **Session Management** with persistent login

### 👥 User Management
- **Multi-role Support**: Admin, Teacher, Student
- **User Profiles** with detailed information
- **Profile Management** with avatar and bio
- **User Search & Filtering**

### 📚 Course Management
- **Course Creation & Editing** (Teachers & Admins)
- **Course Categories & Levels**
- **Prerequisites & Learning Objectives**
- **Course Enrollment System**
- **Progress Tracking**

### 💬 Messaging System
- **Real-time Messaging** between users
- **Course-specific Messages**
- **Announcements** (Teachers & Admins)
- **Message Threads & Conversations**
- **Unread Message Tracking**

### 🧪 Quiz System
- **Quiz Creation & Management**
- **Multiple Question Types**
- **Auto-grading System**
- **Quiz Results & Analytics**
- **Student Progress Tracking**

### 📊 Dashboard & Analytics
- **Role-specific Dashboards**
- **Progress Analytics**
- **Enrollment Statistics**
- **Performance Metrics**

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Heroicons** for icons
- **React Hot Toast** for notifications
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **cors** for cross-origin requests

### Database
- **MongoDB** for data persistence
- **Mongoose** for schema management
- **Indexed collections** for performance

## 📁 Project Structure

```
lms-project/
├── backend/                 # Node.js Backend
│   ├── models/             # MongoDB Schemas
│   ├── routes/             # API Routes
│   ├── middleware/         # Custom Middleware
│   ├── scripts/            # Database Scripts
│   └── server.js           # Main Server File
├── src/                    # React Frontend
│   ├── components/         # Reusable Components
│   ├── pages/              # Page Components
│   ├── services/           # API Services
│   └── App.jsx             # Main App Component
├── public/                 # Static Assets
└── package.json            # Dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lms-project.git
   cd lms-project
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Environment Setup**
   ```bash
   # Copy backend environment file
   cp backend/env.example backend/.env
   
   # Edit backend/.env with your configuration
   MONGODB_URI=mongodb://localhost:27017/lms-project
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5001
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Seed the Database**
   ```bash
   cd backend
   node scripts/seed.js
   ```

7. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```

8. **Start the Frontend Development Server**
   ```bash
   # In a new terminal
   npm run dev
   ```

9. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## 👤 Default Login Credentials

### Admin Account
- **Email**: admin@lms.com
- **Password**: admin123
- **Role**: Admin (Full access)

### Teacher Account
- **Email**: priya.sharma@lms.com
- **Password**: teacher123
- **Role**: Teacher (Course management)

### Student Account
- **Email**: aisha.khan@student.com
- **Password**: student123
- **Role**: Student (Course enrollment)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Users
- `GET /api/users` - Get all users (Admin)
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (Teacher/Admin)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course (Teacher/Admin)
- `DELETE /api/courses/:id` - Delete course (Teacher/Admin)

### Enrollments
- `GET /api/enrollments` - Get enrollments
- `POST /api/enrollments/enroll/:courseId` - Enroll in course
- `DELETE /api/enrollments/unenroll/:courseId` - Unenroll from course

### Messages
- `GET /api/messages/inbox` - Get user messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversation/:userId` - Get conversation
- `PATCH /api/messages/:id/read` - Mark as read

### Quizzes
- `GET /api/quizzes` - Get quizzes
- `POST /api/quizzes` - Create quiz (Teacher/Admin)
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/:id/results` - Get quiz results

## 🔧 Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
npm start            # Start production server
npm run dev          # Start with nodemon (if configured)
```

### Database Management
```bash
cd backend
node scripts/seed.js  # Seed database with sample data
```

## 🧪 Testing

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lms.com","password":"admin123"}'

# Test protected endpoint
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📦 Deployment

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

### Backend Deployment
1. Set up environment variables
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Database Deployment
- Use MongoDB Atlas for cloud hosting
- Update `MONGODB_URI` in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with complete LMS functionality
- **v0.9.0** - Backend integration and API development
- **v0.8.0** - Frontend UI/UX improvements
- **v0.7.0** - Messaging system implementation
- **v0.6.0** - Course management features
- **v0.5.0** - User authentication system
- **v0.4.0** - Basic dashboard and navigation
- **v0.3.0** - Initial React setup with routing
- **v0.2.0** - Project structure and planning
- **v0.1.0** - Project initialization
