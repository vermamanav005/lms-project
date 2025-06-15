import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

function TeacherDashboard({ userRole }) {
  // Mock data for demonstration
  const managedCourses = [
    { id: 1, title: 'Introduction to Computer Science', studentCount: 30 },
    { id: 2, title: 'Calculus I', studentCount: 25 },
  ];

  const students = [
    { id: 1, name: 'John Doe', course: 'CS101', progress: 75 },
    { id: 2, name: 'Jane Smith', course: 'Calculus I', progress: 60 },
  ];

  const quizzes = [
    { id: 1, title: 'CS101 Midterm Quiz', course: 'CS101' },
    { id: 2, title: 'Calculus Chapter 3 Quiz', course: 'Calculus I' },
  ];

  const recentActivities = [
    { id: 1, action: 'Created Quiz 3 for CS101', timestamp: '2025-06-14 9:00 AM' },
    { id: 2, action: 'Graded assignments for Calculus I', timestamp: '2025-06-13 4:00 PM' },
  ];

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {userRole || 'Teacher'}!
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your courses, students, and quizzes with ease.
        </p>
      </header>

      {/* Performance Metrics */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Performance Metrics
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <UsersIcon className="h-8 w-8 text-violet-500 mx-auto" />
            <h3 className="mt-2 text-xl font-semibold text-gray-900">
              {students.length}
            </h3>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <BookOpenIcon className="h-8 w-8 text-violet-500 mx-auto" />
            <h3 className="mt-2 text-xl font-semibold text-gray-900">
              {managedCourses.length}
            </h3>
            <p className="text-sm text-gray-600">Courses</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <QuestionMarkCircleIcon className="h-8 w-8 text-violet-500 mx-auto" />
            <h3 className="mt-2 text-xl font-semibold text-gray-900">
              {quizzes.length}
            </h3>
            <p className="text-sm text-gray-600">Quizzes</p>
          </div>
        </div>
      </section>

      {/* Managed Courses */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Managed Courses
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {managedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transform hover:scale-105 transition-transform duration-300"
            >
              <BookOpenIcon className="h-8 w-8 text-violet-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                {course.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {course.studentCount} Students Enrolled
              </p>
              <Link
                to="/courses"
                className="mt-4 inline-block bg-violet-400 text-white py-2 px-4 rounded-md text-sm hover:bg-black transition-colors duration-300"
              >
                Manage
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Student Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Student Overview
        </h2>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${student.progress < 50 ? 'bg-red-300' : 'bg-green-300'} h-2 rounded-full`}
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quiz Management */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Quiz Management
        </h2>
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center"
            >
              <QuestionMarkCircleIcon className="h-8 w-8 text-violet-500 mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {quiz.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Course: {quiz.course}
                </p>
              </div>
              <Link
                to="/quizzes"
                className="bg-violet-400 text-white py-2 px-4 rounded-md text-sm hover:bg-black transition-colors duration-300"
              >
                Edit Quiz
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
              <ClockIcon className="h-6 w-6 text-violet-500 mr-4" />
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

export default TeacherDashboard;