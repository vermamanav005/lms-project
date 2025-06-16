import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  BookOpenIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

function Sidebar({ userRole, isSidebarOpen, toggleSidebar, closeSidebar }) {
  const menuItems = {
    Student: [
      { path: '/dashboard', name: 'Dashboard', icon: ChartBarIcon },
      { path: '/enrolled-courses', name: 'Enrolled Courses', icon: BookOpenIcon },
      { path: '/quizzes', name: 'Quizzes', icon: QuestionMarkCircleIcon },
    ],
    Teacher: [
      { path: '/dashboard', name: 'Dashboard', icon: ChartBarIcon },
      { path: '/courses', name: 'Courses', icon: BookOpenIcon },
      { path: '/students', name: 'Students', icon: UsersIcon },
      { path: '/quizzes', name: 'Quizzes', icon: QuestionMarkCircleIcon },
    ],
    Admin: [
      { path: '/admin-dashboard', name: 'Admin Dashboard', icon: ChartBarIcon },
    ],
  };

  const items = menuItems[userRole] || menuItems.Student;

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-300 border-r border-gray-200 shadow-lg z-30 w-72 md:w-64 lg:w-16 lg:hover:w-64 transition-all duration-300 ease-in-out group ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
        <span className="text-xl font-bold text-gray-900">Latte Labs</span>
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100">
          <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="mt-4 px-2">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center px-4 py-3 my-1 text-black rounded-lg hover:bg-white hover:text-violet-500 transition-colors duration-200"
            onClick={closeSidebar}
          >
            <item.icon className="h-6 w-6 mr-3 flex-shrink-0" />
            <span className="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-sm font-medium">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;