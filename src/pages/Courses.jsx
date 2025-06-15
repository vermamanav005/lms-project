import { Link } from 'react-router-dom';
import { BookOpenIcon, PlusIcon } from '@heroicons/react/24/outline';

function Courses() {
  // Mock data for teacher-managed courses
  const managedCourses = [
    { id: 1, title: 'Introduction to Computer Science', studentCount: 30 },
    { id: 2, title: 'Calculus I', studentCount: 25 },
  ];

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
        <Link
          to="/courses/add"
          className="inline-flex items-center bg-violet-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-black transition-colors duration-300"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Course
        </Link>
      </header>

      <section>
        {managedCourses.length === 0 ? (
          <p className="text-gray-600 text-center">No courses available. Add a course to get started!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {managedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transform hover:scale-105 transition-transform duration-300"
              >
                <BookOpenIcon className="h-8 w-8 text-violet-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{course.studentCount} Students Enrolled</p>
                <Link
                  to={`/courses/${course.id}`}
                  className="mt-4 inline-block bg-violet-400 text-white py-2 px-4 rounded-md text-sm hover:bg-black transition-colors duration-300"
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Courses;