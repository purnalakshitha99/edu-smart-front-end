import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Trophy, Clock, BookOpen } from "lucide-react";

interface ExamReport {
  report_id: string;
  exam_id: string;
  exam_name: string;
  subject: string;
  score: number;
  timestamp: string;
  answers: Record<number, number>;
}

interface PaginatedResponse {
  reports: ExamReport[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

const AnswerReport = () => {
  const [reports, setReports] = useState<ExamReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_BASE_URL = "http://127.0.0.1:5005";
  const userId = localStorage.getItem("userid");

  useEffect(() => {
    fetchExamReports();
  }, [currentPage]);

  const fetchExamReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/get-user-exam-reports/${userId}?page=${currentPage}&limit=10`,
        {
          credentials: "include",
          mode: "cors",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exam reports");
      }

      const data: PaginatedResponse = await response.json();
      setReports(data.reports);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error("Error fetching exam reports:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excellent! 🎉";
    if (score >= 80) return "Great job! 👏";
    if (score >= 70) return "Good work! 👍";
    if (score >= 60) return "Not bad! 📚";
    return "Keep studying! 💪";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Your Exam Reports
            </h2>
            <p className="text-gray-600">
              View your exam history and performance
            </p>
          </div>

          <div className="space-y-4">
            {reports.map((report) => (
              <Link
                key={report.report_id}
                to={`/result-details/${report.exam_id}`}
                className="block"
              >
                <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {report.exam_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{report.subject}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{report.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-3xl font-bold ${getScoreColor(
                          report.score
                        )} mb-1`}
                      >
                        {report.score}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {getScoreMessage(report.score)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          {reports.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No exam reports found. Take an exam to see your results here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerReport;
