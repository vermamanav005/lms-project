import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

function Home() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Welcome to LatteLabs
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Discover a world of learning with our intuitive platform for students, teachers, and admins. Explore courses, quizzes, and more!
          </p>
          <Link
            to="/login"
            className="mt-8 inline-block bg-violet-400 text-white py-3 px-6 rounded-full text-lg font-medium hover:bg-black hover:text-white transition-colors duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Why Choose LatteLabs?
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <BookOpenIcon className="h-12 w-12 text-violet-500 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 text-center">
                Comprehensive Courses
              </h3>
              <p className="mt-2 text-gray-400 text-center">
                Access a wide range of courses tailored for students and managed by teachers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <QuestionMarkCircleIcon className="h-12 w-12 text-violet-500 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 text-center">
                Engaging Quizzes
              </h3>
              <p className="mt-2 text-gray-400 text-center">
                Test your knowledge with interactive quizzes designed to enhance learning.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <UsersIcon className="h-12 w-12 text-violet-500 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 text-center">
                Role-Based Access
              </h3>
              <p className="mt-2 text-gray-400 text-center">
                Personalized dashboards for students, teachers, and admins.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;