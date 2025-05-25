import React, { useEffect, useState } from "react";
import { BookOpen, Award, Clock, FileText } from "lucide-react";
import axios from "axios";

// Define types for report and examReport
interface ExamReport {
  report_id: string;
  exam_id: string;
  exam_name: string;
  subject: string;
  score: number;
  timestamp: number;
  answers: Record<string, any>;
}

interface ReportData {
  reports: ExamReport[];
  total: number;
  page: number;
  total_pages: number;
}

const UserReport = () => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const userId = localStorage.getItem("userid");
        console.log("user id", userId);
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5005/get-user-exam-reports/${userId}`
        );

        setReport(response.data);
      } catch (err) {
        setError("Failed to fetch report data");
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);
  console.log("reports", report);
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    return "F";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Reports
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!report || !report.reports || report.reports.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Reports Found
          </h2>
          <p className="text-gray-600">You haven't taken any exams yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Exam Reports
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 ">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Total Reports: {report.total}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Page {report.page} of {report.total_pages}
            </span>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid gap-6">
          {report.reports.map((examReport: ExamReport) => (
            <div
              key={examReport.report_id}
              className="bg-white rounded-lg shadow-md overflow-hidden p-5"
            >
              {/* Report Header */}
              <div className="">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold capitalize">
                      {examReport.exam_name}
                    </h2>
                    <p className=" text-black capitalize flex items-center gap-2 mt-1">
                      <BookOpen className="h-4 w-4" />
                      Subject: {examReport.subject}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getScoreColor(
                        examReport.score
                      )} text-opacity-100`}
                    >
                      <Award className="h-5 w-5 mr-2" />
                      {examReport.score}% ({getScoreGrade(examReport.score)})
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Details */}
              <div className="p-6">
                {/* Performance Summary */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Performance Summary
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {examReport.score}%
                      </p>
                      <p className="text-sm text-gray-600">Score</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {getScoreGrade(examReport.score)}
                      </p>
                      <p className="text-sm text-gray-600">Grade</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {Object.keys(examReport.answers).length}
                      </p>
                      <p className="text-sm text-gray-600">Questions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">
                        {Math.round(
                          (examReport.score / 100) *
                            Object.keys(examReport.answers).length
                        )}
                      </p>
                      <p className="text-sm text-gray-600">Correct</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination (if needed) */}
        {report.total_pages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <span className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
                {report.page}
              </span>
              <button className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReport;
