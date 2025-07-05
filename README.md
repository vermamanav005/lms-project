# Learning Management System (LMS)

A comprehensive Learning Management System built with React, Node.js, and MongoDB. This system provides a complete platform for educational institutions to manage courses, students, teachers, and learning content.

## 🚀 Features

### For Students
- **Course Enrollment**: Browse and enroll in available courses
- **Progress Tracking**: Monitor learning progress with visual indicators
- **Quiz Taking**: Take quizzes and view results
- **Course Materials**: Access course content and resources
- **Messaging**: Communicate with teachers and admins
- **Dashboard**: View enrolled courses and recent activities

### For Teachers
- **Course Management**: Create, edit, and manage courses
- **Student Management**: View enrolled students and their progress
- **Quiz Creation**: Create and manage quizzes for assessment
- **Messaging**: Send announcements and communicate with students
- **Analytics**: View course statistics and student performance
- **Content Management**: Upload and organize course materials

### For Administrators
- **User Management**: Manage all users (students, teachers, admins)
- **System Overview**: Dashboard with system-wide statistics
- **Course Oversight**: Monitor all courses and enrollments
- **Messaging**: Send system-wide announcements
- **Role Management**: Assign and manage user roles

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Heroicons** - Icon library
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Hook Form** - Form management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lms-project
   JWT_SECRET=your_jwt_secret_here
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

5. **Seed the database** (optional):
   ```bash
   npm run seed
   ```

### Frontend Setup

1. **Navigate to project root**:
   ```bash
   cd ..
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

## 🗄️ Database Schema

### Users
- Name, email, password, role (Student/Teacher/Admin)
- Profile information and preferences
- Account status and creation date

### Courses
- Title, description, instructor
- Category, level, duration
- Status (active/inactive/draft)
- Enrollment count and course materials

### Enrollments
- Student and course references
- Enrollment date and progress
- Last accessed timestamp
- Quiz results and completion status

### Quizzes
- Title, description, course reference
- Questions with multiple choice answers
- Time limits and due dates
- Scoring and results tracking

### Messages
- Sender and recipient references
- Subject, content, and message type
- Course association for announcements
- Read status and timestamps

## 🔐 Authentication & Authorization

### User Roles
- **Student**: Can enroll in courses, take quizzes, view materials
- **Teacher**: Can create/manage courses, view students, create quizzes
- **Admin**: Full system access, user management, system oversight

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS protection
- Rate limiting
- Input validation and sanitization

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Users
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Teacher/Admin)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Enrollments
- `GET /api/enrollments` - Get enrollments
- `POST /api/enrollments/enroll/:courseId` - Enroll in course
- `DELETE /api/enrollments/unenroll/:courseId` - Unenroll from course

### Quizzes
- `GET /api/quizzes` - Get quizzes
- `POST /api/quizzes` - Create quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/:id/results` - Get quiz results

### Messages
- `GET /api/messages/inbox` - Get user messages
- `POST /api/messages` - Send message
- `PATCH /api/messages/:id/read` - Mark as read
- `DELETE /api/messages/:id` - Delete message

## 🎨 UI Components

### Navigation
- Responsive sidebar with role-based menu items
- Top navigation bar with user info and logout
- Breadcrumb navigation for better UX

### Dashboard
- Role-specific dashboards with relevant statistics
- Quick action buttons for common tasks
- Recent activity feeds

### Forms
- Consistent form styling with validation
- Modal forms for quick actions
- File upload capabilities

### Tables
- Sortable and filterable data tables
- Pagination for large datasets
- Action buttons for each row

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Configure MongoDB connection
3. Set up reverse proxy (nginx)
4. Use PM2 for process management

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure environment variables
4. Set up custom domain if needed

## 📊 Sample Data

The seed script creates:
- 1 Admin user (admin@lms.com / password123)
- 3 Teacher users with sample courses
- 10 Student users with enrollments
- Sample quizzes and course materials

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Future Enhancements

- Real-time notifications
- Video conferencing integration
- Advanced analytics and reporting
- Mobile app development
- Integration with external LMS systems
- Advanced assessment types
- File management system
- Calendar integration
