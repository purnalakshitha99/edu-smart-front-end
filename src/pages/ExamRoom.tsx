import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { useParams } from "react-router-dom";

const TechQuizApp = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const questions = quizData?.questions || [];
  const { examId } = useParams();
  useEffect(() => {
    fetchQuizById(examId);
  }, []);
  // Timer effect
  useEffect(() => {
    if (quizStarted && quizData && quizData > 0 && !showResults) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0 && quizStarted) {
      handleFinishQuiz();
    }
  }, [timeLeft, quizStarted, showResults, quizData]);

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer - 1) {
        correctCount++;
      }
    });
    return Math.round((correctCount / questions.length) * 100);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionIndex,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(selectedAnswers[currentQuestion + 1] ?? null);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(selectedAnswers[currentQuestion - 1] ?? null);
    }
  };

  const API_BASE_URL = "http://127.0.0.1:5005";
  const handleFinishQuiz = async () => {
    setShowResults(true);

    const userId = localStorage.getItem("userid");

    const examData = {
      userId: userId,
      examId: examId,
      score: calculateScore(),
      answers: selectedAnswers,
    };
    const response = await fetch(`${API_BASE_URL}/submit-exam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(examData),
      credentials: "include",
      mode: "cors",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit exam");
    }

    await response.json();
    alert("Exam submitted successfully!");
  };
  const fetchQuizById = async (quizId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/get-qa/${quizId}`, {
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quiz details");
      }

      const quizData = await response.json();
      setQuizData(quizData);
      setTimeLeft(quizData.time_limit * 60);
    } catch (err) {
      console.error("Error fetching quiz details:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizStarted(false);
    setSelectedOption(null);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Excellent! 🎉";
    if (score >= 80) return "Great job! 👏";
    if (score >= 70) return "Good work! 👍";
    if (score >= 60) return "Not bad! 📚";
    return "Keep studying! 💪";
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Tech Quiz</h1>
            <p className="text-gray-600">Test your technology knowledge</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Questions</span>
              <span className="font-semibold text-gray-800">
                {questions.length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Time Limit</span>
              <span className="font-semibold text-gray-800">
                {quizData.time_limit} minutes
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Subject</span>
              <span className="font-semibold text-gray-800 capitalize">
                {quizData.subject}
              </span>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const score = calculateScore();
    const correctAnswers = Math.round((score / 100) * questions.length);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Quiz Complete!
            </h2>
            <p className="text-gray-600">{getScoreMessage(score)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div
                className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}
              >
                {score}%
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
                {questions.length - correctAnswers}
              </div>
              <div className="text-gray-600">Incorrect</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold text-gray-800">
              Review Answers
            </h3>
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const correctAnswer = question.answer - 1;
              const isCorrect = userAnswer === correctAnswer;

              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-2">
                        {index + 1}. {question.question}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-600">Your answer: </span>
                          <span
                            className={
                              userAnswer !== undefined
                                ? isCorrect
                                  ? "text-green-600"
                                  : "text-red-600"
                                : "text-gray-500"
                            }
                          >
                            {userAnswer !== undefined
                              ? question.options[userAnswer]
                              : "Not answered"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm">
                            <span className="text-gray-600">
                              Correct answer:{" "}
                            </span>
                            <span className="text-green-600">
                              {question.options[correctAnswer]}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* <button
            onClick={resetQuiz}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Take Quiz Again
          </button> */}
        </div>
      </div>
    );
  }

  // Quiz screen
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800"> Quiz</h1>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5 text-blue-600" />
              <span
                className={timeLeft <= 60 ? "text-red-600" : "text-blue-600"}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  selectedOption === index
                    ? "border-blue-500 bg-blue-50 text-blue-800"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedOption === index && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 font-semibold rounded-lg transition-all duration-200"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestion(index);
                  setSelectedOption(selectedAnswers[index] ?? null);
                }}
                className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                  index === currentQuestion
                    ? "bg-blue-500 text-white"
                    : selectedAnswers[index] !== undefined
                    ? "bg-green-100 text-green-800 border-2 border-green-300"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleFinishQuiz}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              Finish Quiz
              <Trophy className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechQuizApp;
