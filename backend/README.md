# LMS Backend API

A robust Node.js/Express backend for the Learning Management System, providing RESTful APIs for user management, course management, messaging, and quiz systems.

## 🚀 Features

### 🔐 Authentication & Security
- **JWT-based Authentication** with secure token management
- **Password Hashing** using bcryptjs
- **Role-based Access Control** (Admin, Teacher, Student)
- **Input Validation** with express-validator
- **CORS Protection** for cross-origin requests
- **Error Handling** middleware for consistent responses

### 📊 Database Management
- **MongoDB** with Mongoose ODM
- **Optimized Schemas** with proper indexing
- **Data Validation** at the schema level
- **Database Seeding** with sample data
- **Connection Management** with error handling

### 🛠️ API Features
- **RESTful Design** with consistent endpoints
- **Pagination** for large datasets
- **Search & Filtering** capabilities
- **File Upload** support (configurable)
- **Real-time Updates** ready for WebSocket integration

## 📁 Project Structure

```
backend/
├── models/              # MongoDB Schemas
│   ├── User.js         # User model with roles
│   ├── Course.js       # Course management
│   ├── Enrollment.js   # Student enrollments
│   ├── Quiz.js         # Quiz system
│   └── Message.js      # Messaging system
├── routes/              # API Routes
│   ├── auth.js         # Authentication endpoints
│   ├── users.js        # User management
│   ├── courses.js      # Course operations
│   ├── enrollments.js  # Enrollment management
│   ├── quizzes.js      # Quiz operations
│   └── messages.js     # Messaging system
├── middleware/          # Custom Middleware
│   ├── auth.js         # JWT authentication
│   └── error.js        # Error handling
├── scripts/             # Database Scripts
│   └── seed.js         # Database seeding
├── server.js           # Main server file
├── package.json        # Dependencies
└── .env               # Environment variables
```

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   ```

3. **Configure Environment Variables**
   ```env
   # Server Configuration
   PORT=5001
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/lms-project

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here

   # Frontend URL
   FRONTEND_URL=http://localhost:5173

   # Email Configuration (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # File Upload
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   ```

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Seed the Database**
   ```bash
   node scripts/seed.js
   ```

6. **Start the Server**
   ```bash
   npm start
   ```

7. **Access the API**
   - Base URL: http://localhost:5001
   - API Documentation: http://localhost:5001/api

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/login` | User login | Public |
| POST | `/register` | User registration | Public |
| GET | `/me` | Get current user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/change-password` | Change password | Private |
| POST | `/forgot-password` | Request password reset | Public |
| POST | `/reset-password` | Reset password with token | Public |
| POST | `/logout` | User logout | Private |

### Users (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all users | Admin |
| POST | `/` | Create new user | Admin |
| GET | `/:id` | Get user by ID | Admin/Owner |
| PUT | `/:id` | Update user | Admin/Owner |
| DELETE | `/:id` | Delete user | Admin |
| GET | `/students` | Get all students | Admin/Teacher |
| GET | `/teachers` | Get all teachers | Admin |

### Courses (`/api/courses`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all courses | Public |
| POST | `/` | Create course | Teacher/Admin |
| GET | `/:id` | Get course details | Public |
| PUT | `/:id` | Update course | Teacher/Admin |
| DELETE | `/:id` | Delete course | Teacher/Admin |
| GET | `/teacher/:teacherId` | Get teacher's courses | Public |
| GET | `/enrolled` | Get enrolled courses | Student |
| GET | `/search` | Search courses | Public |

### Enrollments (`/api/enrollments`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all enrollments | Admin |
| POST | `/` | Create enrollment | Admin |
| GET | `/:id` | Get enrollment details | Admin/Owner |
| PUT | `/:id` | Update enrollment | Admin/Owner |
| DELETE | `/:id` | Delete enrollment | Admin |
| GET | `/student/:studentId` | Get student enrollments | Admin/Student |
| GET | `/course/:courseId` | Get course enrollments | Admin/Teacher |
| POST | `/enroll/:courseId` | Enroll in course | Student |
| DELETE | `/unenroll/:courseId` | Unenroll from course | Student |

### Quizzes (`/api/quizzes`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all quizzes | Public |
| POST | `/` | Create quiz | Teacher/Admin |
| GET | `/:id` | Get quiz details | Public |
| PUT | `/:id` | Update quiz | Teacher/Admin |
| DELETE | `/:id` | Delete quiz | Teacher/Admin |
| GET | `/course/:courseId` | Get course quizzes | Public |
| POST | `/:id/submit` | Submit quiz answers | Student |
| GET | `/:id/results` | Get quiz results | Teacher/Admin |
| GET | `/results` | Get student quiz results | Student |

### Messages (`/api/messages`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/inbox` | Get user messages | Private |
| POST | `/` | Send message | Private |
| GET | `/conversation/:userId` | Get conversation | Private |
| GET | `/course/:courseId` | Get course messages | Private |
| PATCH | `/:id/read` | Mark as read | Private |
| DELETE | `/:id` | Delete message | Owner |
| GET | `/unread/count` | Get unread count | Private |
| GET | `/users` | Get users for messaging | Private |

## 🗄️ Database Models

### User Model
```javascript
{
  firstName: String,        // Required
  lastName: String,         // Required
  email: String,           // Required, unique
  password: String,        // Required, hashed
  role: String,            // 'Student', 'Teacher', 'Admin'
  avatar: String,          // Profile image URL
  bio: String,             // User bio
  phone: String,           // Phone number
  isActive: Boolean,       // Account status
  isEmailVerified: Boolean, // Email verification
  lastLogin: Date,         // Last login timestamp
  // Teacher specific
  specialization: String,
  experience: Number,
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  // Student specific
  grade: String,
  enrollmentDate: Date
}
```

### Course Model
```javascript
{
  title: String,           // Required
  description: String,     // Required
  instructor: ObjectId,    // Reference to User
  category: String,        // Course category
  level: String,           // 'Beginner', 'Intermediate', 'Advanced'
  duration: Number,        // Course duration in hours
  price: Number,           // Course price
  isPublished: Boolean,    // Publication status
  isFeatured: Boolean,     // Featured course flag
  prerequisites: [String], // Course prerequisites
  learningObjectives: [String], // Learning objectives
  syllabus: [{
    week: Number,
    title: String,
    description: String,
    topics: [String],
    duration: Number
  }],
  enrollmentCount: Number, // Number of enrolled students
  rating: Number,          // Course rating
  reviews: [{
    student: ObjectId,
    rating: Number,
    comment: String,
    date: Date
  }]
}
```

### Enrollment Model
```javascript
{
  student: ObjectId,       // Reference to User
  course: ObjectId,        // Reference to Course
  enrolledAt: Date,        // Enrollment date
  progress: Number,        // Progress percentage (0-100)
  lastAccessed: Date,      // Last access timestamp
  completedAt: Date,       // Completion date
  grade: String,           // Final grade
  certificate: String,     // Certificate URL
  notes: String,           // Student notes
  status: String           // 'active', 'completed', 'dropped'
}
```

### Quiz Model
```javascript
{
  title: String,           // Required
  description: String,     // Quiz description
  course: ObjectId,        // Reference to Course
  questions: [{
    question: String,      // Question text
    type: String,          // 'multiple-choice', 'true-false'
    options: [String],     // Answer options
    correctAnswer: Number, // Index of correct answer
    points: Number         // Points for this question
  }],
  timeLimit: Number,       // Time limit in minutes
  passingScore: Number,    // Minimum score to pass
  isActive: Boolean,       // Quiz availability
  startDate: Date,         // Quiz start date
  endDate: Date,           // Quiz end date
  attemptsAllowed: Number  // Number of allowed attempts
}
```

### Message Model
```javascript
{
  sender: ObjectId,        // Reference to User
  recipient: ObjectId,     // Reference to User
  subject: String,         // Message subject
  content: String,         // Message content
  messageType: String,     // 'personal', 'announcement', 'course'
  course: ObjectId,        // Reference to Course (optional)
  isRead: Boolean,         // Read status
  readAt: Date,            // Read timestamp
  isImportant: Boolean,    // Important message flag
  isArchived: Boolean      // Archive status
}
```

## 🔐 Authentication

### JWT Token Structure
```javascript
{
  userId: "user_id_here",
  iat: 1672531200,        // Issued at
  exp: 1673136000         // Expires at (7 days)
}
```

### Protected Routes
All protected routes require the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

### Role-based Access
- **Admin**: Full access to all endpoints
- **Teacher**: Course management, student viewing, messaging
- **Student**: Course enrollment, quiz taking, messaging

## 🧪 Testing

### API Testing with curl

1. **Login and get token**
   ```bash
   curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@lms.com","password":"admin123"}'
   ```

2. **Use token for protected requests**
   ```bash
   curl -X GET http://localhost:5001/api/auth/me \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

3. **Create a course**
   ```bash
   curl -X POST http://localhost:5001/api/courses \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Test Course",
       "description": "A test course",
       "category": "Programming",
       "level": "Beginner",
       "duration": 10,
       "price": 99.99
     }'
   ```

### Database Testing
```bash
# Connect to MongoDB
mongosh

# Switch to database
use lms-project

# View collections
show collections

# Query users
db.users.find()

# Query courses
db.courses.find()
```

## 🔧 Development

### Scripts
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (if configured)
npm run seed       # Seed database
npm test           # Run tests (if configured)
```

### Environment Variables
- `PORT`: Server port (default: 5001)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend URL for CORS
- `EMAIL_*`: Email configuration (optional)
- `MAX_FILE_SIZE`: Maximum file upload size
- `UPLOAD_PATH`: File upload directory

### Error Handling
The API uses consistent error responses:
```javascript
{
  success: false,
  message: "Error description",
  errors: [] // Validation errors (if any)
}
```

### Success Responses
```javascript
{
  success: true,
  message: "Operation successful",
  data: {} // Response data
}
```

## 🔒 Security Considerations

### JWT Security
- Use strong, unique JWT secrets
- Set appropriate token expiration times
- Validate token on every request
- Implement token refresh mechanism

### Database Security
- Use connection pooling
- Implement proper indexing
- Validate all inputs
- Use parameterized queries

### API Security
- Implement rate limiting
- Use HTTPS in production
- Validate request headers
- Sanitize user inputs

## 📊 Performance Optimization

### Database Optimization
- Create indexes on frequently queried fields
- Use aggregation pipelines for complex queries
- Implement pagination for large datasets
- Use projection to limit returned fields

### API Optimization
- Implement response caching
- Use compression middleware
- Optimize database queries
- Implement request validation

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB service is running
   - Verify connection string
   - Check network connectivity

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

3. **CORS Errors**
   - Update FRONTEND_URL in .env
   - Check CORS configuration
   - Verify request headers

4. **Validation Errors**
   - Check request body format
   - Verify required fields
   - Check data types

### Logs
```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log

# View MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

 
