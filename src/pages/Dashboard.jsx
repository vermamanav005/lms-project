import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

function Dashboard({ userRole }) {
  // Mock data for demonstration
  const enrolledCourses = [
    { id: 1, title: 'Introduction to Computer Science', progress: 75 },
    { id: 2, title: 'Calculus I', progress: 50 },
    { id: 3, title: 'World History', progress: 20 },
  ];

  const upcomingQuizzes = [
    { id: 1, title: 'CS101 Midterm Quiz', dueDate: '2025-06-20' },
    { id: 2, title: 'Calculus Chapter 3 Quiz', dueDate: '2025-06-22' },
  ];

  const recentActivities = [
    { id: 1, action: 'Completed Lesson 5 in CS101', timestamp: '2025-06-14 10:30 AM' },
    { id: 2, action: 'Submitted Quiz 2 in Calculus', timestamp: '2025-06-13 3:15 PM' },
  ];

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {userRole || 'Student'}!
        </h1>
        <p className="mt-2 text-gray-500">
          Your personalized dashboard to track your learning journey.
        </p>
      </header>

      {/* Progress Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Overall Progress
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-300 h-4 rounded-full"
              style={{ width: '60%' }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            60% of your courses completed
          </p>
        </div>
      </section>

      {/* Enrolled Courses */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Enrolled Courses
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transform hover:scale-105 transition-transform duration-300"
            >
              <BookOpenIcon className="h-8 w-8 text-violet-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                {course.title}
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`${course.progress < 50 ? 'bg-red-400' : 'bg-green-300'} h-2 rounded-full`}
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {course.progress}% Complete
              </p>
              <Link
                to="/enrolled-courses"
                className="mt-4 inline-block bg-violet-400 text-white py-2 px-4 rounded-md text-sm hover:bg-black hover:text-white transition-colors duration-300"
              >
                Continue
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Quizzes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Upcoming Quizzes
        </h2>
        <div className="space-y-4">
          {upcomingQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center"
            >
              <QuestionMarkCircleIcon className="h-8 w-8 text-violet-400 mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {quiz.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Due: {quiz.dueDate}
                </p>
              </div>
              <Link
                to="/quizzes"
                className="bg-violet-400 text-white py-2 px-4 rounded-md text-sm hover:bg-black transition-colors duration-300"
              >
                Take Quiz
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center py-2 border-b border-gray-200 last:border-b-0"
            >
              <ClockIcon className="h-6 w-6 text-violet-400 mr-4" />
              <div>
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;