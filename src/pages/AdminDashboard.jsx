import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, BookOpenIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

function AdminDashboard({ currentUser }) {
  // Mock data for users
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Teacher' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Student' },
  ]);

  // Mock data for courses
  const courses = [
    { id: 1, title: 'Introduction to Computer Science', teacher: 'Jane Smith', studentCount: 30 },
    { id: 2, title: 'Calculus I', teacher: 'Jane Smith', studentCount: 25 },
  ];

  // State for add user form
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Student' });
  const [errors, setErrors] = useState({});

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateAddUser = () => {
    const newErrors = {};
    if (!newUser.name.trim()) newErrors.name = 'Name is required';
    if (!newUser.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(newUser.email)) newErrors.email = 'Invalid email format';
    return newErrors;
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateAddUser();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const user = { id: users.length + 1, ...newUser };
    console.log({ action: 'add_user', data: user });
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'Student' });
    setShowAddUserForm(false);
  };

  const handleDeleteUser = (id) => {
    console.log({ action: 'delete_user', id });
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleDeleteCourse = (id) => {
    console.log({ action: 'delete_course', id });
  };

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* User Management */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
          <button
            onClick={() => setShowAddUserForm(!showAddUserForm)}
            className="inline-flex items-center bg-violet-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-black"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>

        {showAddUserForm && (
          <form
            onSubmit={handleAddUserSubmit}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleAddUserChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleAddUserChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleAddUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setShowAddUserForm(false)}
                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-violet-400 text-white rounded-md text-sm font-medium hover:bg-black"
              >
                Save
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Course Management */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Course Management</h2>
          <Link
            to="/courses/add"
            className="inline-flex items-center bg-violet-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-black"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Course
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transform hover:scale-105 transition-transform duration-300"
            >
              <BookOpenIcon className="h-8 w-8 text-violet-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
              <p className="mt-1 text-sm text-gray-600">Teacher: {course.teacher}</p>
              <p className="mt-1 text-sm text-gray-600">{course.studentCount} Students</p>
              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="mt-4 inline-flex items-center bg-red-400 text-white py-2 px-4 rounded-md text-sm hover:bg-red-600"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;