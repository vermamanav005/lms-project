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

  // Map routes to page names
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

  // Map routes to icons
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

  // Get the page name and icon for the current route
  const pageName = routePageNames[location.pathname] || 'Dashboard';
  const CurrentIcon = routeIcons[location.pathname] || ChartBarIcon;

  // Construct breadcrumb text
  const breadcrumbText = isAuthenticated && userRole
    ? `${userRole} > ${pageName}`
    : pageName;

  // Handle logout with redirection
  const handleLogoutAndRedirect = () => {
    handleLogout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white text-violet-500 border-b border-gray-200 shadow-md fixed top-0 w-full z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {isAuthenticated }
            <Link to="/" className="flex items-center text-2xl font-bold">
              <CurrentIcon className="h-8 w-8 mr-2" />
              {breadcrumbText}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-full text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-violet-400 text-white'
                    : 'hover:bg-black hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogoutAndRedirect}
                className="px-3 py-2 rounded-full text-sm font-medium hover:bg-red-400 hover:text-white"
              >
                Logout
              </button>
            )}
          </div>

          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;