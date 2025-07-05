import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  CalendarIcon, 
  ClockIcon,
  ChartBarIcon,
  PlayIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { enrollmentsAPI, coursesAPI } from '../services/api';
import toast from 'react-hot-toast';

function EnrolledCourses({ currentUser }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgress, setFilterProgress] = useState('all');

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      const response = await enrollmentsAPI.getByStudent(currentUser._id);
      setEnrollments(response.data);
    } catch (error) {
      toast.error('Failed to load enrolled courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.course.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgress = filterProgress === 'all' || 
                           (filterProgress === 'completed' && enrollment.progress >= 100) ||
                           (filterProgress === 'in-progress' && enrollment.progress < 100);
    return matchesSearch && matchesProgress;
  });

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    if (progress >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="h-8 w-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enrolled Courses</h1>
        <p className="text-gray-600">Track your learning progress and access course materials</p>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <select
            value={filterProgress}
            onChange={(e) => setFilterProgress(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Progress</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </header>

      <section>
        {filteredEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">
              {searchTerm || filterProgress !== 'all' 
                ? 'No courses match your search criteria.' 
                : 'You are not enrolled in any courses. Explore courses to get started!'}
            </p>
            {!searchTerm && filterProgress === 'all' && (
              <Link
                to="/courses"
                className="inline-block mt-4 bg-violet-500 text-white py-2 px-4 rounded-md hover:bg-violet-600 transition-colors duration-300"
              >
                Browse Courses
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEnrollments.map((enrollment) => (
              <div
                key={enrollment._id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <BookOpenIcon className="h-8 w-8 text-violet-500" />
                  <span className={`text-sm font-medium ${getProgressColor(enrollment.progress)}`}>
                    {enrollment.progress}% Complete
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{enrollment.course.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {enrollment.course.description || 'No description available'}
                </p>
                
                <div className="space-y-2 mb-4">
                  {enrollment.course.instructor && (
                    <div className="flex items-center text-sm text-gray-500">
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      {enrollment.course.instructor.name}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Last accessed: {new Date(enrollment.lastAccessed || enrollment.enrolledAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressBarColor(enrollment.progress)}`}
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/enrolled-courses/${enrollment.course._id}`}
                    className="flex-1 inline-flex items-center justify-center bg-violet-500 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-violet-600 transition-colors duration-300"
                  >
                    <PlayIcon className="h-4 w-4 mr-1" />
                    Continue
                  </Link>
                  <Link
                    to={`/enrolled-courses/${enrollment.course._id}/materials`}
                    className="inline-flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-300"
                    title="Course Materials"
                  >
                    <DocumentTextIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/enrolled-courses/${enrollment.course._id}/quizzes`}
                    className="inline-flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-300"
                    title="Quizzes"
                  >
                    <QuestionMarkCircleIcon className="h-4 w-4" />
                  </Link>
                </div>

                {/* Quick Stats */}
                {enrollment.course.quizzes && enrollment.course.quizzes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Quizzes completed:</span>
                      <span className="font-medium">
                        {enrollment.quizResults?.filter(q => q.completed).length || 0} / {enrollment.course.quizzes.length}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default EnrolledCourses;