import { ChartBarIcon } from '@heroicons/react/24/outline';

function AdminDashboard({ userRole }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to the {userRole} Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Manage users, courses, and system settings from here.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          </div>
          <p className="mt-2 text-gray-600">
            View and manage all users (students, teachers, admins) in the system.
          </p>
          <a
            href="/users"
            className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700"
          >
            Manage Users
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Course Oversight</h2>
          </div>
          <p className="mt-2 text-gray-600">
            Monitor and manage all courses offered in the platform.
          </p>
          <a
            href="/courses"
            className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700"
          >
            View Courses
          </a>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;