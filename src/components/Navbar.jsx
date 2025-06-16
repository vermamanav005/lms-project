import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  BookOpenIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

function Navbar({ isAuthenticated, userRole, handleLogout, toggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = isAuthenticated
    ? [
        { path: userRole === 'Admin' ? '/admin-dashboard' : '/dashboard', label: userRole === 'Admin' ? 'Admin Dashboard' : 'Dashboard' },
      ]
    : [
        { path: '/', label: 'Home' },
        { path: '/login', label: 'Login' },
        { path: '/signup', label: 'Signup' },
      ];

  const routePageNames = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/admin-dashboard': 'Admin Dashboard',
    '/courses': 'Courses',
    '/courses/add': 'Add Course',
    '/students': 'Students',
    '/quizzes': 'Quizzes',
    '/enrolled-courses': 'Enrolled Courses',
    '/login': 'Login',
    '/signup': 'Signup',
  };

  const routeIcons = {
    '/': HomeIcon,
    '/dashboard': ChartBarIcon,
    '/admin-dashboard': ChartBarIcon,
    '/courses': BookOpenIcon,
    '/courses/add': BookOpenIcon,
    '/students': UsersIcon,
    '/quizzes': QuestionMarkCircleIcon,
    '/enrolled-courses': BookOpenIcon,
    '/login': ArrowRightOnRectangleIcon,
    '/signup': UserPlusIcon,
  };

  const pageName = routePageNames[location.pathname] || 'Dashboard';
  const CurrentIcon = routeIcons[location.pathname] || ChartBarIcon;
  const breadcrumbText = isAuthenticated && userRole
    ? `${userRole} > ${pageName}`
    : pageName;

  const handleLogoutAndRedirect = () => {
    handleLogout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white text-violet-500 border-b border-gray-200 shadow-mdsidebar fixed top-0 w-full z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {isAuthenticated && (
              <button
                onClick={toggleSidebar}
                className="mr-3 p-2 rounded-full hover:bg-gray-100 lg:hidden"
                aria-label="Toggle Sidebar"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            {isAuthenticated ? (
              <span className="flex items-center text-xl font-bold">
                <CurrentIcon className="h-7 w-7 mr-2" />
                {breadcrumbText}
              </span>
            ) : (
              <Link to="/" className="flex items-center text-xl font-bold">
                <CurrentIcon className="h-7 w-7 mr-2" />
                {breadcrumbText}
              </Link>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-violet-400 text-white'
                    : 'hover:bg-violet-500 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogoutAndRedirect}
                className="px-4 py-2 rounded-full text-sm font-medium hover:bg-red-400 hover:text-white"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Toggle Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-violet-400 text-white'
                    : 'text-violet-500 hover:bg-violet-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogoutAndRedirect}
                className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-violet-500 hover:bg-red-100 hover:text-red-500"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;