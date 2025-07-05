# LMS Backend API

A comprehensive Learning Management System backend built with Node.js, Express, and MongoDB.

## Features

- **User Management**: Authentication, authorization, and role-based access control
- **Course Management**: Create, update, and manage courses with rich content
- **Enrollment System**: Student enrollment tracking and progress management
- **Quiz System**: Create and take quizzes with various question types
- **Messaging System**: Cross-communication between teachers, students, and admins
- **Real-time Features**: WebSocket support for live interactions
- **File Upload**: Support for course materials and user avatars
- **Security**: JWT authentication, input validation, and rate limiting

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **File Upload**: Multer

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lms-project/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/lms-project
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/teachers` - Get all teachers
- `GET /api/users/students` - Get all students (Admin/Teacher only)
- `GET /api/users/stats` - Get user statistics (Admin only)

### Courses
- `GET /api/courses` - Get all courses with filters
- `GET /api/courses/featured` - Get featured courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create a new course (Teacher/Admin)
- `PUT /api/courses/:id` - Update course (Instructor/Admin)
- `DELETE /api/courses/:id` - Delete course (Instructor/Admin)
- `POST /api/courses/:id/rate` - Rate a course
- `GET /api/courses/search` - Search courses

### Enrollments
- `POST /api/enrollments` - Enroll in a course
- `GET /api/enrollments` - Get user's enrollments
- `GET /api/enrollments/:id` - Get enrollment by ID
- `PUT /api/enrollments/:id/progress` - Update enrollment progress
- `PUT /api/enrollments/:id/complete-lesson` - Mark lesson as completed
- `DELETE /api/enrollments/:id` - Drop course enrollment
- `GET /api/enrollments/course/:courseId` - Get course enrollments (Instructor/Admin)
- `PUT /api/enrollments/:id/grade` - Grade student enrollment (Instructor/Admin)

### Quizzes
- `POST /api/quizzes` - Create a new quiz (Teacher/Admin)
- `GET /api/quizzes` - Get quizzes with filters
- `GET /api/quizzes/:id` - Get quiz by ID
- `PUT /api/quizzes/:id` - Update quiz (Instructor/Admin)
- `DELETE /api/quizzes/:id` - Delete quiz (Instructor/Admin)
- `POST /api/quizzes/:id/take` - Take a quiz
- `GET /api/quizzes/course/:courseId` - Get quizzes for a course

### Messages
- `POST /api/messages` - Send a message
- `GET /api/messages/inbox` - Get user's inbox
- `GET /api/messages/sent` - Get user's sent messages
- `GET /api/messages/archived` - Get user's archived messages
- `GET /api/messages/:id` - Get message by ID
- `PUT /api/messages/:id/read` - Mark message as read
- `PUT /api/messages/:id/archive` - Archive/unarchive message
- `GET /api/messages/conversation/:userId` - Get conversation with user
- `GET /api/messages/course/:courseId/announcements` - Get course announcements

## User Roles

### Admin
- Full access to all features
- User management
- System-wide course management
- Analytics and reporting

### Teacher
- Create and manage courses
- Create quizzes and assignments
- Grade student work
- Send course announcements
- View student progress

### Student
- Browse and enroll in courses
- Take quizzes and assignments
- Track learning progress
- Communicate with teachers
- Access course materials

## Database Models

### User
- Authentication and profile information
- Role-based permissions
- Teacher-specific fields (specialization, experience)
- Student-specific fields (grade, enrollment date)

### Course
- Course information and content
- Instructor assignment
- Syllabus and materials
- Ratings and enrollment tracking

### Enrollment
- Student-course relationship
- Progress tracking
- Grade and score management
- Payment information

### Quiz
- Quiz configuration and questions
- Multiple question types
- Scoring and time limits
- Attempt tracking

### Message
- Direct messaging between users
- Course announcements
- Message status and organization

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Granular access control
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Secure cross-origin requests
- **Password Hashing**: Bcrypt password encryption
- **Helmet Security**: HTTP security headers

## Error Handling

- Centralized error handling middleware
- Consistent error response format
- Detailed error logging
- User-friendly error messages

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_URL` - Frontend application URL
- `EMAIL_HOST` - SMTP host for email notifications
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - SMTP username
- `EMAIL_PASS` - SMTP password

## Sample Data

The seed script creates:
- 1 Admin user
- 3 Teacher users
- 5 Student users
- 4 Sample courses
- 2 Sample quizzes

### Sample Login Credentials
- **Admin**: admin@lms.com / admin123
- **Teacher**: john.smith@lms.com / teacher123
- **Student**: alice.wilson@student.com / student123

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "errors": [
    // Validation errors
  ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 