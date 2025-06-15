import { Link } from 'react-router-dom';
import { BookOpenIcon } from '@heroicons/react/24/outline';

function EnrolledCourses() {
  // Mock data for enrolled courses
  const enrolledCourses = [
    {
      id: 1,
      title: 'Introduction to Computer Science',
      teacher: 'Dr. John Smith',
      progress: 75,
    },
    {
      id: 2,
      title: 'Calculus I',
      teacher: 'Prof. Jane Doe',
      progress: 40,
    },
  ];

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Enrolled Courses</h1>
      </header>

      <section>
        {enrolledCourses.length === 0 ? (
          <p className="text-gray-600 text-center">
            You are not enrolled in any courses. Explore courses to get started!
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transform hover:scale-105 transition-transform duration-300"
              >
                <BookOpenIcon className="h-8 w-8 text-violet-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <p className="mt-1 text-sm text-gray-600">Teacher: {course.teacher}</p>
                <p className="mt-1 text-sm text-gray-600">Progress: {course.progress}%</p>
                <Link
                  to={`/enrolled-courses/${course.id}`}
                  className="mt-4 inline-block bg-violet-400 text-white py-2 px-4 rounded-md text-sm hover:bg-black transition-colors duration-300"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default EnrolledCourses;