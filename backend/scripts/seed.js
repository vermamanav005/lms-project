import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms-project');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Quiz.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: 'admin@lms.com',
      password: 'admin123',
      role: 'Admin',
      isActive: true,
      isEmailVerified: true
    });
    await adminUser.save();
    console.log('Created admin user');

    // Create teacher users
    const teacher1 = new User({
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@lms.com',
      password: 'teacher123',
      role: 'Teacher',
      specialization: 'Web Development',
      experience: 5,
      education: [
        {
          degree: 'Master of Computer Science',
          institution: 'IIT Delhi',
          year: 2018
        }
      ],
      bio: 'Experienced web developer with expertise in React, Node.js, and modern web technologies.',
      isActive: true,
      isEmailVerified: true
    });
    await teacher1.save();

    const teacher2 = new User({
      firstName: 'Arjun',
      lastName: 'Patel',
      email: 'arjun.patel@lms.com',
      password: 'teacher123',
      role: 'Teacher',
      specialization: 'Data Science',
      experience: 7,
      education: [
        {
          degree: 'PhD in Statistics',
          institution: 'IISc Bangalore',
          year: 2016
        }
      ],
      bio: 'Data scientist and machine learning expert with a passion for teaching.',
      isActive: true,
      isEmailVerified: true
    });
    await teacher2.save();

    const teacher3 = new User({
      firstName: 'Meera',
      lastName: 'Reddy',
      email: 'meera.reddy@lms.com',
      password: 'teacher123',
      role: 'Teacher',
      specialization: 'UI/UX Design',
      experience: 4,
      education: [
        {
          degree: 'Bachelor of Design',
          institution: 'NID Ahmedabad',
          year: 2019
        }
      ],
      bio: 'Creative designer focused on user experience and interface design.',
      isActive: true,
      isEmailVerified: true
    });
    await teacher3.save();
    console.log('Created teacher users');

    // Create student users
    const students = [
      {
        firstName: 'Aisha',
        lastName: 'Khan',
        email: 'aisha.khan@student.com',
        password: 'student123',
        grade: 'Sophomore',
        bio: 'Computer Science student passionate about web development.'
      },
      {
        firstName: 'Rahul',
        lastName: 'Verma',
        email: 'rahul.verma@student.com',
        password: 'student123',
        grade: 'Junior',
        bio: 'Mathematics major interested in data science and machine learning.'
      },
      {
        firstName: 'Kavya',
        lastName: 'Singh',
        email: 'kavya.singh@student.com',
        password: 'student123',
        grade: 'Senior',
        bio: 'Design student looking to improve my UI/UX skills.'
      },
      {
        firstName: 'Aditya',
        lastName: 'Gupta',
        email: 'aditya.gupta@student.com',
        password: 'student123',
        grade: 'Freshman',
        bio: 'New to programming and excited to learn web development.'
      },
      {
        firstName: 'Zara',
        lastName: 'Malhotra',
        email: 'zara.malhotra@student.com',
        password: 'student123',
        grade: 'Graduate',
        bio: 'Graduate student focusing on advanced web technologies.'
      }
    ];

    for (const studentData of students) {
      const student = new User({
        ...studentData,
        role: 'Student',
        isActive: true,
        isEmailVerified: true
      });
      await student.save();
    }
    console.log('Created student users');

    // Create courses
    const courses = [
      {
        title: 'Complete React Development Bootcamp',
        description: 'Learn React from scratch to advanced concepts. Build real-world projects and master modern web development.',
        instructor: teacher1._id,
        category: 'Programming',
        level: 'Intermediate',
        duration: 40,
        price: 99.99,
        isPublished: true,
        isFeatured: true,
        prerequisites: ['Basic JavaScript knowledge', 'HTML and CSS fundamentals'],
        learningObjectives: [
          'Master React fundamentals and hooks',
          'Build scalable React applications',
          'Implement state management with Redux',
          'Deploy React apps to production'
        ],
        syllabus: [
          {
            week: 1,
            title: 'React Fundamentals',
            description: 'Introduction to React and JSX',
            topics: ['JSX', 'Components', 'Props', 'State'],
            duration: 8
          },
          {
            week: 2,
            title: 'React Hooks',
            description: 'Modern React with hooks',
            topics: ['useState', 'useEffect', 'useContext', 'Custom hooks'],
            duration: 10
          },
          {
            week: 3,
            title: 'State Management',
            description: 'Managing complex state',
            topics: ['Redux', 'Context API', 'State patterns'],
            duration: 12
          },
          {
            week: 4,
            title: 'Advanced Concepts',
            description: 'Performance and deployment',
            topics: ['Performance optimization', 'Testing', 'Deployment'],
            duration: 10
          }
        ],
        tags: ['React', 'JavaScript', 'Web Development', 'Frontend'],
        rating: { average: 4.8, count: 156 },
        enrollmentCount: 89
      },
      {
        title: 'Data Science Fundamentals',
        description: 'Master the fundamentals of data science including Python, statistics, and machine learning.',
        instructor: teacher2._id,
        category: 'Science',
        level: 'Beginner',
        duration: 35,
        price: 129.99,
        isPublished: true,
        isFeatured: true,
        prerequisites: ['Basic Python knowledge'],
        learningObjectives: [
          'Understand data science workflow',
          'Master Python for data analysis',
          'Learn statistical concepts',
          'Build machine learning models'
        ],
        syllabus: [
          {
            week: 1,
            title: 'Introduction to Data Science',
            description: 'Overview of data science field',
            topics: ['Data science workflow', 'Python basics', 'Jupyter notebooks'],
            duration: 8
          },
          {
            week: 2,
            title: 'Data Manipulation',
            description: 'Working with data in Python',
            topics: ['Pandas', 'NumPy', 'Data cleaning', 'Exploratory analysis'],
            duration: 10
          },
          {
            week: 3,
            title: 'Statistics and Visualization',
            description: 'Statistical concepts and data visualization',
            topics: ['Descriptive statistics', 'Matplotlib', 'Seaborn', 'Hypothesis testing'],
            duration: 10
          },
          {
            week: 4,
            title: 'Machine Learning Basics',
            description: 'Introduction to machine learning',
            topics: ['Supervised learning', 'Unsupervised learning', 'Model evaluation'],
            duration: 7
          }
        ],
        tags: ['Data Science', 'Python', 'Machine Learning', 'Statistics'],
        rating: { average: 4.9, count: 203 },
        enrollmentCount: 145
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Learn modern UI/UX design principles and tools to create beautiful, user-friendly interfaces.',
        instructor: teacher3._id,
        category: 'Design',
        level: 'Beginner',
        duration: 30,
        price: 79.99,
        isPublished: true,
        isFeatured: false,
        prerequisites: ['Basic design sense', 'Familiarity with design tools'],
        learningObjectives: [
          'Understand UX design principles',
          'Master UI design tools',
          'Create user-centered designs',
          'Build design systems'
        ],
        syllabus: [
          {
            week: 1,
            title: 'UX Fundamentals',
            description: 'Understanding user experience',
            topics: ['User research', 'Personas', 'User journeys', 'Information architecture'],
            duration: 8
          },
          {
            week: 2,
            title: 'UI Design Principles',
            description: 'Visual design fundamentals',
            topics: ['Color theory', 'Typography', 'Layout principles', 'Visual hierarchy'],
            duration: 8
          },
          {
            week: 3,
            title: 'Design Tools',
            description: 'Mastering design software',
            topics: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping'],
            duration: 8
          },
          {
            week: 4,
            title: 'Design Systems',
            description: 'Creating scalable design systems',
            topics: ['Component libraries', 'Design tokens', 'Documentation', 'Implementation'],
            duration: 6
          }
        ],
        tags: ['UI/UX', 'Design', 'Figma', 'User Experience'],
        rating: { average: 4.7, count: 89 },
        enrollmentCount: 67
      },
      {
        title: 'Advanced JavaScript Concepts',
        description: 'Deep dive into advanced JavaScript concepts including ES6+, async programming, and design patterns.',
        instructor: teacher1._id,
        category: 'Programming',
        level: 'Advanced',
        duration: 25,
        price: 89.99,
        isPublished: true,
        isFeatured: false,
        prerequisites: ['Intermediate JavaScript knowledge', 'Basic programming concepts'],
        learningObjectives: [
          'Master ES6+ features',
          'Understand async programming',
          'Learn design patterns',
          'Write clean, maintainable code'
        ],
        syllabus: [
          {
            week: 1,
            title: 'ES6+ Features',
            description: 'Modern JavaScript features',
            topics: ['Arrow functions', 'Destructuring', 'Modules', 'Classes'],
            duration: 8
          },
          {
            week: 2,
            title: 'Async Programming',
            description: 'Working with asynchronous code',
            topics: ['Promises', 'Async/await', 'Event loop', 'Callbacks'],
            duration: 8
          },
          {
            week: 3,
            title: 'Design Patterns',
            description: 'Common JavaScript patterns',
            topics: ['Module pattern', 'Observer pattern', 'Factory pattern', 'Singleton'],
            duration: 6
          },
          {
            week: 4,
            title: 'Advanced Concepts',
            description: 'Advanced JavaScript topics',
            topics: ['Closures', 'Prototypes', 'Memory management', 'Performance'],
            duration: 3
          }
        ],
        tags: ['JavaScript', 'ES6', 'Async Programming', 'Design Patterns'],
        rating: { average: 4.6, count: 67 },
        enrollmentCount: 42
      }
    ];

    for (const courseData of courses) {
      const course = new Course(courseData);
      await course.save();
    }
    console.log('Created courses');

    // Create sample quizzes
    const reactQuiz = new Quiz({
      title: 'React Fundamentals Quiz',
      description: 'Test your knowledge of React basics including components, props, and state.',
      course: courses[0].instructor, // This will be the course ID
      instructor: teacher1._id,
      questions: [
        {
          question: 'What is JSX in React?',
          type: 'multiple_choice',
          options: [
            { text: 'A JavaScript library', isCorrect: false },
            { text: 'A syntax extension for JavaScript', isCorrect: true },
            { text: 'A CSS framework', isCorrect: false },
            { text: 'A database technology', isCorrect: false }
          ],
          points: 2,
          explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript.'
        },
        {
          question: 'Which hook is used to manage state in functional components?',
          type: 'multiple_choice',
          options: [
            { text: 'useState', isCorrect: true },
            { text: 'useEffect', isCorrect: false },
            { text: 'useContext', isCorrect: false },
            { text: 'useReducer', isCorrect: false }
          ],
          points: 2,
          explanation: 'useState is the hook used to add state to functional components.'
        },
        {
          question: 'Props in React are immutable.',
          type: 'true_false',
          options: [
            { text: 'True', isCorrect: true },
            { text: 'False', isCorrect: false }
          ],
          points: 1,
          explanation: 'Props are read-only and cannot be modified by the component receiving them.'
        }
      ],
      timeLimit: 15,
      passingScore: 70,
      category: 'practice',
      isActive: true
    });
    await reactQuiz.save();

    const dataScienceQuiz = new Quiz({
      title: 'Data Science Basics Quiz',
      description: 'Test your understanding of fundamental data science concepts.',
      course: courses[1].instructor, // This will be the course ID
      instructor: teacher2._id,
      questions: [
        {
          question: 'What is the primary purpose of exploratory data analysis (EDA)?',
          type: 'multiple_choice',
          options: [
            { text: 'To build machine learning models', isCorrect: false },
            { text: 'To understand and summarize data', isCorrect: true },
            { text: 'To clean data', isCorrect: false },
            { text: 'To visualize data', isCorrect: false }
          ],
          points: 2,
          explanation: 'EDA is used to understand the data, identify patterns, and generate insights.'
        },
        {
          question: 'Which Python library is most commonly used for data manipulation?',
          type: 'short_answer',
          correctAnswer: 'pandas',
          points: 2,
          explanation: 'Pandas is the most popular library for data manipulation and analysis in Python.'
        }
      ],
      timeLimit: 20,
      passingScore: 75,
      category: 'practice',
      isActive: true
    });
    await dataScienceQuiz.save();
    console.log('Created sample quizzes');

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@lms.com / admin123');
    console.log('Teacher: priya.sharma@lms.com / teacher123');
    console.log('Student: aisha.khan@student.com / student123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData(); 