import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Trophy, ArrowLeft, Download } from "lucide-react";
import axios from "axios";
import { usePDF } from "react-to-pdf";

interface Question {
    question: string;
    options: string[];
    answer: number; // This should be 1-based index of the correct answer
}

interface ExamData {
    _id: { $oid: string };
    name: string;
    subject: string;
    questions: Question[];
}

interface ExamResult {
    exam_id: string;
    report_id: string;
    score: number;
    timestamp: string;
    exam_data: ExamData;
    answers: Record<string, number>; // Keys are strings representing question indices
}

const ExamResultDetail = () => {
    const { id } = useParams();
    const [examResult, setExamResult] = useState<ExamResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    // PDF generation setup
    const { toPDF, targetRef } = usePDF({
        filename: `exam-result-${examResult?.exam_data.name || 'report'}.pdf`,
        page: {
            margin: 20,
            format: 'A4',
        }
    });

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const userId = localStorage.getItem("userid");
                const response = await axios.get(
                    `http://localhost:5005/get-user-exam-reports/${userId}`
                );
                const filtered = response.data.reports.find((e: any) => e.exam_id === id);

                setExamResult(filtered || null);
            } catch (error) {
                console.error("Failed to fetch result", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResult();
    }, [id]);

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

    if (!examResult) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">No exam result found</div>
            </div>
        );
    }

    const { exam_data, timestamp, answers } = examResult;
    const { name: exam_name, subject, questions } = exam_data;
    const totalQuestions = questions.length;

    // Calculate correct answers (FIXED VERSION)
    const correctAnswers = Object.entries(answers).reduce((count, [questionIndex, userAnswer]) => {
        const questionIndexInt = parseInt(questionIndex);

        if (isNaN(questionIndexInt)) {
            console.error(`Invalid questionIndex: ${questionIndex}`);
            return count;
        }

        if (questionIndexInt < 0 || questionIndexInt >= questions.length) {
            console.error(`questionIndex out of bounds: ${questionIndexInt}`);
            return count;
        }

        const userAnswerInt = parseInt(String(userAnswer));

        if (isNaN(userAnswerInt)) {
            console.error(`Invalid userAnswer: ${userAnswer}`);
            return count;
        }

        // FIX: Convert 1-based answer to 0-based for comparison
        const correctAnswer = questions[questionIndexInt].answer - 1;

        if (userAnswerInt === correctAnswer) {
            return count + 1;
        } else {
            return count;
        }
    }, 0);

    const percentageScore = Math.round((correctAnswers / totalQuestions) * 100);
    const incorrectAnswers = totalQuestions - correctAnswers;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
            <div className="max-w-4xl mx-auto w-full">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Reports
                    </button>
                    
                    <button
                        onClick={() => toPDF()}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>

                <div ref={targetRef} className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-1">{exam_name}</h2>
                        <p className="text-gray-600">{subject}</p>
                    </div>

                    <div className="text-center text-gray-700 mb-6">
                        <p className="text-sm">
                            Attempted on:{" "}
                            <span className="font-medium">
                                {new Date(timestamp).toLocaleString()}
                            </span>
                        </p>
                        <p className="text-sm">
                            Total Questions:{" "}
                            <span className="font-medium">{totalQuestions}</span>
                        </p>
                        <p className="text-xl font-semibold text-indigo-600 mt-2">
                            {getScoreMessage(percentageScore)}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div
                                className={`text-4xl font-bold ${getScoreColor(percentageScore)} mb-2`}
                            >
                                {percentageScore}%
                            </div>
                            <div className="text-gray-600">Score</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-4xl font-bold text-green-600 mb-2">
                                {correctAnswers}
                            </div>
                            <div className="text-gray-600">Correct</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-4xl font-bold text-red-600 mb-2">
                                {incorrectAnswers}
                            </div>
                            <div className="text-gray-600">Incorrect</div>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Question Review</h3>
                    <div className="space-y-6">
                        {questions.map((question, index) => {
                            const userAnswer = answers[index.toString()];
                            // FIX: Convert 1-based answer to 0-based
                            const correctAnswer = question.answer - 1;
                            const isCorrect = parseInt(String(userAnswer)) === correctAnswer;

                            return (
                                <div
                                    key={index}
                                    className="border rounded-xl p-6 shadow-sm bg-white hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        {isCorrect ? (
                                            <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                        ) : (
                                            <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800 mb-4">
                                                {index + 1}. {question.question}
                                            </p>
                                            <div className="space-y-3">
                                                {question.options.map((option, optionIndex) => {
                                                    const isUserAnswer = parseInt(String(userAnswer)) === optionIndex;
                                                    const isCorrectOption = correctAnswer === optionIndex;

                                                    return (
                                                        <div
                                                            key={optionIndex}
                                                            className={`p-3 rounded-lg border-2 flex items-center gap-3 ${
                                                                isUserAnswer
                                                                    ? isCorrect
                                                                        ? "border-green-500 bg-green-50"
                                                                        : "border-red-500 bg-red-50"
                                                                    : isCorrectOption
                                                                    ? "border-green-500 bg-green-50"
                                                                    : "border-gray-200"
                                                            }`}
                                                        >
                                                            <div
                                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                                    isUserAnswer || isCorrectOption
                                                                        ? isCorrect || isCorrectOption
                                                                            ? "bg-green-500 border-green-500"
                                                                            : "bg-red-500 border-red-500"
                                                                        : "border-gray-300"
                                                                }`}
                                                            >
                                                                {(isUserAnswer || isCorrectOption) && (
                                                                    <div className="w-2 h-2 rounded-full bg-white" />
                                                                )}
                                                            </div>
                                                            <span
                                                                className={`text-sm ${
                                                                    isUserAnswer
                                                                        ? isCorrect
                                                                            ? "text-green-700 font-medium"
                                                                            : "text-red-700 font-medium"
                                                                        : isCorrectOption
                                                                        ? "text-green-700 font-medium"
                                                                        : "text-gray-700"
                                                                }`}
                                                            >
                                                                {option}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamResultDetail;