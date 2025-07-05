import { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const grades = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

  // Mock data - replace with API call
  useEffect(() => {
    const mockStudents = [
      {
        _id: '1',
        firstName: 'Alice',
        lastName: 'Wilson',
        email: 'alice.wilson@student.com',
        avatar: '',
        grade: 'Sophomore',
        enrollmentDate: '2023-09-01',
        bio: 'Computer Science student passionate about web development.',
        phone: '+1 (555) 123-4567',
        isActive: true,
        enrollments: 3,
        completedCourses: 2,
        averageGrade: 'A-'
      },
      {
        _id: '2',
        firstName: 'Bob',
        lastName: 'Davis',
        email: 'bob.davis@student.com',
        avatar: '',
        grade: 'Junior',
        enrollmentDate: '2022-08-15',
        bio: 'Mathematics major interested in data science and machine learning.',
        phone: '+1 (555) 234-5678',
        isActive: true,
        enrollments: 5,
        completedCourses: 4,
        averageGrade: 'A'
      },
      {
        _id: '3',
        firstName: 'Carol',
        lastName: 'Miller',
        email: 'carol.miller@student.com',
        avatar: '',
        grade: 'Senior',
        enrollmentDate: '2021-09-01',
        bio: 'Design student looking to improve my UI/UX skills.',
        phone: '+1 (555) 345-6789',
        isActive: true,
        enrollments: 7,
        completedCourses: 6,
        averageGrade: 'B+'
      },
      {
        _id: '4',
        firstName: 'David',
        lastName: 'Garcia',
        email: 'david.garcia@student.com',
        avatar: '',
        grade: 'Freshman',
        enrollmentDate: '2024-01-15',
        bio: 'New to programming and excited to learn web development.',
        phone: '+1 (555) 456-7890',
        isActive: true,
        enrollments: 1,
        completedCourses: 0,
        averageGrade: 'N/A'
      },
      {
        _id: '5',
        firstName: 'Emma',
        lastName: 'Taylor',
        email: 'emma.taylor@student.com',
        avatar: '',
        grade: 'Graduate',
        enrollmentDate: '2023-06-01',
        bio: 'Graduate student focusing on advanced web technologies.',
        phone: '+1 (555) 567-8901',
        isActive: true,
        enrollments: 4,
        completedCourses: 3,
        averageGrade: 'A+'
      }
    ];

    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = filterGrade === '' || student.grade === filterGrade;
    
    return matchesSearch && matchesGrade;
  });

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleSendMessage = (student) => {
    // Implement messaging functionality
    console.log('Send message to:', student.email);
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'A-':
      case 'B+':
        return 'text-blue-600 bg-blue-100';
      case 'B':
      case 'B-':
        return 'text-yellow-600 bg-yellow-100';
      case 'C+':
      case 'C':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="mt-2 text-gray-600">
            Manage and view all enrolled students
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-800">
            {filteredStudents.length} students
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors">
              Export List
            </button>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleViewStudent(student)}
                  className="p-1 text-gray-400 hover:text-violet-600 transition-colors"
                  title="View Details"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleSendMessage(student)}
                  className="p-1 text-gray-400 hover:text-violet-600 transition-colors"
                  title="Send Message"
                >
                  <EnvelopeIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <AcademicCapIcon className="h-4 w-4 mr-2" />
                <span>{student.grade}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
              </div>

              {student.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  <span>{student.phone}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{student.enrollments}</div>
                  <div className="text-gray-500">Enrolled</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{student.completedCourses}</div>
                  <div className="text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className={`font-semibold px-2 py-1 rounded text-xs ${getGradeColor(student.averageGrade)}`}>
                    {student.averageGrade}
                  </div>
                  <div className="text-gray-500">Avg Grade</div>
                </div>
              </div>

              {student.bio && (
                <p className="text-sm text-gray-600 line-clamp-2">{student.bio}</p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewStudent(student)}
                  className="flex-1 bg-violet-50 text-violet-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-violet-100 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleSendMessage(student)}
                  className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Student Detail Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Student Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedStudent.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grade</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedStudent.grade}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Enrollment Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}
                  </p>
                </div>
                
                {selectedStudent.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStudent.phone}</p>
                  </div>
                )}
                
                {selectedStudent.bio && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStudent.bio}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => handleSendMessage(selectedStudent)}
                  className="flex-1 bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-violet-700 transition-colors"
                >
                  Send Message
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;