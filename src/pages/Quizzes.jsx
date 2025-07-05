import { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const categories = ['practice', 'midterm', 'final', 'assignment'];
  const statuses = ['active', 'inactive', 'scheduled', 'expired'];

  // Mock data - replace with API call
  useEffect(() => {
    const mockQuizzes = [
      {
        _id: '1',
        title: 'React Fundamentals Quiz',
        description: 'Test your knowledge of React basics including components, props, and state.',
        course: {
          _id: '1',
          title: 'Complete React Development Bootcamp'
        },
        instructor: {
          _id: '1',
          firstName: 'John',
          lastName: 'Smith'
        },
        category: 'practice',
        isActive: true,
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questionCount: 10,
        totalPoints: 20,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        attempts: 0,
        bestScore: null,
        questions: [
          {
            _id: '1',
            question: 'What is JSX in React?',
            type: 'multiple_choice',
            options: [
              { text: 'A JavaScript library', isCorrect: false },
              { text: 'A syntax extension for JavaScript', isCorrect: true },
              { text: 'A CSS framework', isCorrect: false },
              { text: 'A database technology', isCorrect: false }
            ],
            points: 2
          },
          {
            _id: '2',
            question: 'Which hook is used to manage state in functional components?',
            type: 'multiple_choice',
            options: [
              { text: 'useState', isCorrect: true },
              { text: 'useEffect', isCorrect: false },
              { text: 'useContext', isCorrect: false },
              { text: 'useReducer', isCorrect: false }
            ],
            points: 2
          },
          {
            _id: '3',
            question: 'Props in React are immutable.',
            type: 'true_false',
            options: [
              { text: 'True', isCorrect: true },
              { text: 'False', isCorrect: false }
            ],
            points: 1
          }
        ]
      },
      {
        _id: '2',
        title: 'Data Science Basics Quiz',
        description: 'Test your understanding of fundamental data science concepts.',
        course: {
          _id: '2',
          title: 'Data Science Fundamentals'
        },
        instructor: {
          _id: '2',
          firstName: 'Sarah',
          lastName: 'Johnson'
        },
        category: 'practice',
        isActive: true,
        timeLimit: 20,
        passingScore: 75,
        maxAttempts: 2,
        questionCount: 8,
        totalPoints: 16,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        attempts: 1,
        bestScore: 85,
        questions: []
      },
      {
        _id: '3',
        title: 'JavaScript Advanced Concepts',
        description: 'Advanced JavaScript concepts including ES6+, async programming, and design patterns.',
        course: {
          _id: '3',
          title: 'Advanced JavaScript Concepts'
        },
        instructor: {
          _id: '1',
          firstName: 'John',
          lastName: 'Smith'
        },
        category: 'midterm',
        isActive: true,
        timeLimit: 30,
        passingScore: 80,
        maxAttempts: 1,
        questionCount: 15,
        totalPoints: 30,
        startDate: '2024-02-01',
        endDate: '2024-02-15',
        attempts: 0,
        bestScore: null,
        questions: []
      }
    ];

    setTimeout(() => {
      setQuizzes(mockQuizzes);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.course.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === '' || quiz.category === filterCategory;
    const matchesStatus = filterStatus === '' || getQuizStatus(quiz) === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getQuizStatus = (quiz) => {
    const now = new Date();
    const startDate = new Date(quiz.startDate);
    const endDate = new Date(quiz.endDate);

    if (!quiz.isActive) return 'inactive';
    if (now < startDate) return 'scheduled';
    if (now > endDate) return 'expired';
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'practice':
        return 'text-purple-600 bg-purple-100';
      case 'midterm':
        return 'text-orange-600 bg-orange-100';
      case 'final':
        return 'text-red-600 bg-red-100';
      case 'assignment':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCreateQuiz = () => {
    setShowCreateModal(true);
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowCreateModal(true);
  };

  const handleDeleteQuiz = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(q => q._id !== quizId));
    }
  };

  const handleTakeQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(quiz.timeLimit * 60); // Convert to seconds
    setQuizStarted(true);
    setShowQuizModal(true);
  };

  const handleAnswerQuestion = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;

    selectedQuiz.questions.forEach(question => {
      const answer = answers[question._id];
      if (answer !== undefined) {
        if (question.type === 'multiple_choice' || question.type === 'true_false') {
          if (question.options[answer]?.isCorrect) {
            correctAnswers += question.points;
          }
        }
        totalPoints += question.points;
      }
    });

    const score = totalPoints > 0 ? Math.round((correctAnswers / totalPoints) * 100) : 0;
    const passed = score >= selectedQuiz.passingScore;

    alert(`Quiz completed! Score: ${score}% (${passed ? 'Passed' : 'Failed'})`);
    setShowQuizModal(false);
    setQuizStarted(false);
  };

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
          <p className="mt-2 text-gray-600">
            Create, manage, and take quizzes
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreateQuiz}
            className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Quiz
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => {
          const status = getQuizStatus(quiz);
          return (
            <div key={quiz._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-violet-100 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                    <p className="text-sm text-gray-500">{quiz.course.title}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditQuiz(quiz)}
                    className="p-1 text-gray-400 hover:text-violet-600 transition-colors"
                    title="Edit Quiz"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(quiz._id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Quiz"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(quiz.category)}`}>
                    {quiz.category.charAt(0).toUpperCase() + quiz.category.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Time Limit:</span>
                  <span className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {quiz.timeLimit} min
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Questions:</span>
                  <span className="flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-1" />
                    {quiz.questionCount} ({quiz.totalPoints} pts)
                  </span>
                </div>

                {quiz.bestScore !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Best Score:</span>
                    <span className={`font-medium ${quiz.bestScore >= quiz.passingScore ? 'text-green-600' : 'text-red-600'}`}>
                      {quiz.bestScore}%
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  {status === 'active' && quiz.attempts < quiz.maxAttempts && (
                    <button
                      onClick={() => handleTakeQuiz(quiz)}
                      className="flex-1 bg-violet-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-violet-700 transition-colors flex items-center justify-center"
                    >
                      <PlayIcon className="h-4 w-4 mr-1" />
                      Take Quiz
                    </button>
                  )}
                  <button
                    onClick={() => handleEditQuiz(quiz)}
                    className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Quiz Taking Modal */}
      {showQuizModal && selectedQuiz && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedQuiz.title}
                </h3>
                <div className="flex items-center space-x-4">
                  {quizStarted && (
                    <div className="text-sm font-medium text-red-600">
                      Time: {formatTime(timeLeft)}
                    </div>
                  )}
                  <button
                    onClick={() => setShowQuizModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {!quizStarted ? (
                <div className="space-y-4">
                  <p className="text-gray-600">{selectedQuiz.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Time Limit:</span> {selectedQuiz.timeLimit} minutes
                    </div>
                    <div>
                      <span className="font-medium">Questions:</span> {selectedQuiz.questionCount}
                    </div>
                    <div>
                      <span className="font-medium">Passing Score:</span> {selectedQuiz.passingScore}%
                    </div>
                    <div>
                      <span className="font-medium">Attempts:</span> {selectedQuiz.attempts}/{selectedQuiz.maxAttempts}
                    </div>
                  </div>
                  <button
                    onClick={() => setQuizStarted(true)}
                    className="w-full bg-violet-600 text-white px-4 py-2 rounded-md font-medium hover:bg-violet-700 transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Question {currentQuestion + 1} of {selectedQuiz.questions.length}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {Object.keys(answers).length} answered
                    </span>
                  </div>

                  {selectedQuiz.questions[currentQuestion] && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        {selectedQuiz.questions[currentQuestion].question}
                      </h4>

                      {selectedQuiz.questions[currentQuestion].type === 'multiple_choice' && (
                        <div className="space-y-3">
                          {selectedQuiz.questions[currentQuestion].options.map((option, index) => (
                            <label key={index} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name={`question-${selectedQuiz.questions[currentQuestion]._id}`}
                                value={index}
                                checked={answers[selectedQuiz.questions[currentQuestion]._id] === index}
                                onChange={() => handleAnswerQuestion(selectedQuiz.questions[currentQuestion]._id, index)}
                                className="h-4 w-4 text-violet-600 focus:ring-violet-500"
                              />
                              <span className="text-gray-700">{option.text}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {selectedQuiz.questions[currentQuestion].type === 'true_false' && (
                        <div className="space-y-3">
                          {selectedQuiz.questions[currentQuestion].options.map((option, index) => (
                            <label key={index} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name={`question-${selectedQuiz.questions[currentQuestion]._id}`}
                                value={index}
                                checked={answers[selectedQuiz.questions[currentQuestion]._id] === index}
                                onChange={() => handleAnswerQuestion(selectedQuiz.questions[currentQuestion]._id, index)}
                                className="h-4 w-4 text-violet-600 focus:ring-violet-500"
                              />
                              <span className="text-gray-700">{option.text}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 0}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {currentQuestion === selectedQuiz.questions.length - 1 ? (
                      <button
                        onClick={handleSubmitQuiz}
                        className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-700"
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-700"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quizzes;