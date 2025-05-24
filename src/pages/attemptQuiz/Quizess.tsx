import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Book,
  Clock,
  Calendar,
  ChevronRight,
  Loader2,
  AlertCircle,
  Search,
  FileText,
  Plus,
} from "lucide-react";

const QuizList = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuizDetails, setShowQuizDetails] = useState(false);

  const API_BASE_URL = "http://127.0.0.1:5005";
  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/get-qa?page=${currentPage}&limit=10`,
        {
          credentials: "include",
          mode: "cors",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data = await response.json();
      setQuizzes(data.quizzes || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setError(err.message || "An error occurred while fetching quizzes");
    } finally {
      setLoading(false);
    }
  };
  const handleQuizSelect = async (quizId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/get-qa/${quizId}`, {
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quiz details");
      }

      const quizData = await response.json();
      setSelectedQuiz(quizData);
      setShowQuizDetails(true);
    } catch (err) {
      console.error("Error fetching quiz details:", err);
      setError(err.message || "An error occurred while fetching quiz details");
    } finally {
      setLoading(false);
    }
  };

  const handleTakeQuiz = (quizId) => {
    navigate(`/take-quiz?id=${quizId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return <div className="flex items-center justify-center mt-6">{pages}</div>;
  };

  const handleBackToList = () => {
    setShowQuizDetails(false);
    setSelectedQuiz(null);
  };

  const renderQuizDetails = () => {
    if (!selectedQuiz) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedQuiz.name}
          </h2>
          <button
            onClick={handleBackToList}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to List
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center">
            <Book className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-gray-700">
              <span className="font-medium">Subject:</span>{" "}
              {selectedQuiz.subject}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-gray-700">
              <span className="font-medium">Time Limit:</span>{" "}
              {selectedQuiz.time_limit} minutes
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-gray-700">
              <span className="font-medium">Created:</span>{" "}
              {formatDate(selectedQuiz.created_at)}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Questions ({selectedQuiz.questions?.length || 0})
          </h3>

          <div className="space-y-6">
            {selectedQuiz.questions?.map((question, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-medium text-gray-900 mb-2">
                  {index + 1}. {question.question}
                </h4>
                <ul className="space-y-2 ml-6">
                  {question.options?.map((option, optIndex) => (
                    <li key={optIndex} className="text-gray-600">
                      {String.fromCharCode(65 + optIndex)}. {option}
                      {optIndex === question.answer - 1 && (
                        <span className="ml-2 text-green-600 font-medium">
                          (Correct)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {showQuizDetails ? (
          renderQuizDetails()
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {" "}
            <div className="text-center mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Available Quizzes
                </h1>
                <button
                  onClick={() => navigate("/teacherdashbord")}
                  className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Quiz
                </button>
              </div>
              <p className="text-gray-600">
                Browse and select quizzes to view or take
              </p>
            </div>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-3 text-lg font-medium text-gray-700">
                  Loading quizzes...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            ) : filteredQuizzes.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No quizzes found</p>
              </div>
            ) : (
              <>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Subject
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Questions
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Created
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4">
                          <span className="sr-only">View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredQuizzes.map((quiz) => (
                        <tr key={quiz._id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                            {quiz.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {quiz.subject}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {quiz.question_count}/{quiz.num_questions}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDate(quiz.created_at)}
                          </td>{" "}
                          <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                              <button
                                onClick={() => handleQuizSelect(quiz._id)}
                                className="text-blue-600 hover:text-blue-900 flex items-center"
                              >
                                View
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </button>
                              <button
                                onClick={() => handleTakeQuiz(quiz._id)}
                                className="text-green-600 hover:text-green-900 flex items-center"
                              >
                                Take Quiz
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {renderPagination()}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
