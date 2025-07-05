import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { coursesAPI } from '../services/api';
import toast from 'react-hot-toast';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await coursesAPI.getByTeacher(localStorage.getItem('userId'));
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      await coursesAPI.delete(courseToDelete._id);
      toast.success('Course deleted successfully');
      setCourses(courses.filter(course => course._id !== courseToDelete._id));
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: 'Inactive' },
      draft: { color: 'bg-yellow-100 text-yellow-800', text: 'Draft' }
    };
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <Link
            to="/courses/add"
            className="inline-flex items-center bg-violet-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-violet-600 transition-colors duration-300"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Course
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </header>

      <section>
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'No courses match your search criteria.' 
                : 'No courses available. Add a course to get started!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <BookOpenIcon className="h-8 w-8 text-violet-500" />
                  {getStatusBadge(course.status)}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description || 'No description available'}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    {course.enrollmentCount || 0} Students Enrolled
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </div>
                  {course.instructor && (
                    <div className="flex items-center text-sm text-gray-500">
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      {course.instructor.name}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/courses/${course._id}`}
                    className="flex-1 inline-flex items-center justify-center bg-violet-500 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-violet-600 transition-colors duration-300"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </Link>
                  <Link
                    to={`/courses/${course._id}/edit`}
                    className="inline-flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-300"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setCourseToDelete(course);
                      setShowDeleteModal(true);
                    }}
                    className="inline-flex items-center justify-center bg-red-100 text-red-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-red-200 transition-colors duration-300"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Course</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCourseToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCourse}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;