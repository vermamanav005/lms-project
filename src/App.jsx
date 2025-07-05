import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { authAPI, setAuthToken, getAuthToken } from './services/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import AddCourse from './pages/AddCourse';
import Students from './pages/Students';
import Quizzes from './pages/Quizzes';
import EnrolledCourses from './pages/EnrolledCourses';
import Messages from './pages/Messages';
import CourseDetail from './pages/CourseDetail';

function ProtectedRoute({ isAuthenticated, userRole, allowedRoles, children, redirectAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !redirectAuthenticated) {
      navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`, { replace: true });
    } else if (isAuthenticated && redirectAuthenticated) {
      const redirectTo = userRole === 'Admin' ? '/admin-dashboard' : '/dashboard';
      navigate(redirectTo, { replace: true });
    } else if (isAuthenticated && allowedRoles && !allowedRoles.includes(userRole)) {
      navigate(userRole === 'Admin' ? '/admin-dashboard' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, userRole, allowedRoles, redirectAuthenticated, location.pathname, navigate]);

  return isAuthenticated === !redirectAuthenticated && (!allowedRoles || allowedRoles.includes(userRole))
    ? children
    : null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (role, user) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setCurrentUser(user);
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get('redirectTo') || (role === 'Admin' ? '/admin-dashboard' : '/dashboard');
    navigate(redirectTo, { replace: true });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
    setIsSidebarOpen(false);
    setAuthToken(null);
    navigate('/', { replace: true });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const response = await authAPI.getProfile();
          const user = response.data.data.user;
          setIsAuthenticated(true);
          setUserRole(user.role);
          setCurrentUser(user);
        } catch (error) {
          setAuthToken(null);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Monitor navigation to protected routes
  useEffect(() => {
    if (loading) return;
    
    const protectedRoutes = [
      '/dashboard',
      '/admin-dashboard',
      '/courses',
      '/courses/add',
      '/students',
      '/quizzes',
      '/enrolled-courses',
      '/messages',
    ];
    if (!isAuthenticated && protectedRoutes.includes(location.pathname)) {
      navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <Toaster position="top-right" />
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
          toggleSidebar={isAuthenticated ? toggleSidebar : null}
        />
      </div>
      <main className={`col-start-2 row-start-2 p-4 ${isAuthenticated ? 'lg:ml-16' : ''}`}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                redirectAuthenticated={true}
              >
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                {userRole === 'Teacher' ? (
                  <TeacherDashboard userRole={userRole} currentUser={currentUser} />
                ) : (
                  <Dashboard userRole={userRole} currentUser={currentUser} />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['Admin']}
              >
                <AdminDashboard currentUser={currentUser} />
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
                <Courses currentUser={currentUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['Teacher', 'Admin']}
              >
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/add"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                allowedRoles={['Teacher', 'Admin']}
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
                <EnrolledCourses currentUser={currentUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={userRole}
              >
                <Messages currentUser={currentUser} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;