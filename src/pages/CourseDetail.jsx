import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpenIcon, 
  UsersIcon, 
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  CalendarIcon,
  AcademicCapIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowLeftIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { coursesAPI, enrollmentsAPI, quizzesAPI } from '../services/api';
import toast from 'react-hot-toast';

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      const [courseRes, enrollmentsRes, quizzesRes] = await Promise.all([
        coursesAPI.getById(courseId),
        enrollmentsAPI.getByCourse(courseId),
        quizzesAPI.getByCourse(courseId)
      ]);
      
      setCourse(courseRes.data);
      setEnrollments(enrollmentsRes.data);
      setQuizzes(quizzesRes.data);
    } catch (error) {
      toast.error('Failed to load course data');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await coursesAPI.delete(courseId);
      toast.success('Course deleted successfully');
      navigate('/courses');
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <BookOpenIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/courses"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Courses
            </Link>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/courses/${courseId}/edit`}
              className="inline-flex items-center bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-300"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center bg-red-100 text-red-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-red-200 transition-colors duration-300"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              {course.instructor && (
                <div className="flex items-center">
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  {course.instructor.name}
                </div>
              )}
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Created: {new Date(course.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <UsersIcon className="h-4 w-4 mr-2" />
                {enrollments.length} Students
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BookOpenIcon },
            { id: 'students', name: 'Students', icon: UsersIcon },
            { id: 'materials', name: 'Materials', icon: DocumentTextIcon },
            { id: 'quizzes', name: 'Quizzes', icon: QuestionMarkCircleIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-violet-500 text-violet-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Overview</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">{course.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Course Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Students:</span>
                        <span className="font-medium">{enrollments.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Students:</span>
                        <span className="font-medium">
                          {enrollments.filter(e => e.status === 'active').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Quizzes:</span>
                        <span className="font-medium">{quizzes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Progress:</span>
                        <span className="font-medium">
                          {enrollments.length > 0 
                            ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Course Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${
                          course.status === 'active' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {course.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{course.duration || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Level:</span>
                        <span className="font-medium">{course.level || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{course.category || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Enrolled Students</h2>
                <span className="text-sm text-gray-500">{enrollments.length} students</span>
              </div>
              
              {enrollments.length === 0 ? (
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">No students enrolled yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrolled
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Access
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrollments.map((enrollment) => (
                        <tr key={enrollment._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-violet-600">
                                    {enrollment.student.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {enrollment.student.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {enrollment.student.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-1 mr-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${getProgressBarColor(enrollment.progress)}`}
                                    style={{ width: `${enrollment.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className={`text-sm font-medium ${getProgressColor(enrollment.progress)}`}>
                                {enrollment.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(enrollment.lastAccessed || enrollment.enrolledAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Course Materials</h2>
                <button className="inline-flex items-center bg-violet-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-violet-600 transition-colors duration-300">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Material
                </button>
              </div>
              
              <div className="text-center py-8">
                <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No materials uploaded yet</p>
                <p className="text-sm text-gray-500 mt-2">Upload course materials to help students learn</p>
              </div>
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Course Quizzes</h2>
                <Link
                  to={`/quizzes/create?courseId=${courseId}`}
                  className="inline-flex items-center bg-violet-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-violet-600 transition-colors duration-300"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Quiz
                </Link>
              </div>
              
              {quizzes.length === 0 ? (
                <div className="text-center py-8">
                  <QuestionMarkCircleIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">No quizzes created yet</p>
                  <p className="text-sm text-gray-500 mt-2">Create quizzes to assess student learning</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {quizzes.map((quiz) => (
                    <div key={quiz._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{quiz.questions?.length || 0} questions</span>
                            <span>{quiz.timeLimit || 'No time limit'}</span>
                            <span>Due: {quiz.dueDate ? new Date(quiz.dueDate).toLocaleDateString() : 'No due date'}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/quizzes/${quiz._id}/edit`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/quizzes/${quiz._id}/results`}
                            className="text-green-600 hover:text-green-800"
                          >
                            <ChartBarIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/courses/${courseId}/edit`}
                className="w-full inline-flex items-center justify-center bg-violet-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-violet-600 transition-colors duration-300"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Course
              </Link>
              <Link
                to={`/quizzes/create?courseId=${courseId}`}
                className="w-full inline-flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors duration-300"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Quiz
              </Link>
              <Link
                to={`/messages?courseId=${courseId}`}
                className="w-full inline-flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-600 transition-colors duration-300"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Send Announcement
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Course Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Enrollments:</span>
                  <span className="font-medium">{enrollments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Students:</span>
                  <span className="font-medium">
                    {enrollments.filter(e => e.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Quizzes:</span>
                  <span className="font-medium">{quizzes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Progress:</span>
                  <span className="font-medium">
                    {enrollments.length > 0 
                      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Course</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{course.title}"? This action cannot be undone and will remove all enrollments and quiz data.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
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

export default CourseDetail; 