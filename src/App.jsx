import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import AddCourse from './pages/AddCourse';
import Students from './pages/Students';
import Quizzes from './pages/Quizzes';
import EnrolledCourses from './pages/EnrolledCourses';

function ProtectedRoute({ isAuthenticated, userRole, allowedRoles, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`, { replace: true });
    } else if (allowedRoles && !allowedRoles.includes(userRole)) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, userRole, allowedRoles, location.pathname, navigate]);

  return isAuthenticated && (!allowedRoles || allowedRoles.includes(userRole)) ? children : null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get('redirectTo') || '/dashboard';
    navigate(redirectTo, { replace: true });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setIsSidebarOpen(false);
    navigate('/', { replace: true });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Monitor navigation to protected routes and home page
  useEffect(() => {
    const protectedRoutes = [
      '/dashboard',
      '/courses',
      '/courses/add',
      '/students',
      '/quizzes',
      '/enrolled-courses',
    ];
    if (isAuthenticated && location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    } else if (!isAuthenticated && protectedRoutes.includes(location.pathname)) {
      navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-white grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      {isAuthenticated && (
        <Sidebar
          userRole={userRole}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          closeSidebar={closeSidebar}
        />
      )}
      <div className="col-span-2 row-start-1">
        <Navbar
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          handleLogout={handleLogout}
        />
      </div>
      <main className={`col-start-2 row-start-2 p-4 ${isAuthenticated ? 'lg:ml-16' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                {userRole === 'Teacher' ? (
                  <TeacherDashboard userRole={userRole} />
                ) : (
                  <Dashboard userRole={userRole} />
                )}
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
          <Route
            path="/courses"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['Teacher']}
              >
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/add"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['Teacher']}
              >
                <AddCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['Teacher']}
              >
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                <Quizzes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enrolled-courses"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['Student']}
              >
                <EnrolledCourses />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;