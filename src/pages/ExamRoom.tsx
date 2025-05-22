import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { Clock } from "lucide-react";
import axios from "axios";

const ExamRoom = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/exams");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5005/get-qa/${examId}`
        );
        setQuestions(response.data.questions); // Access the questions array
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [examId]);
  console.log("questions", questions);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSelect = (index) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: index });
  };

  const handleNext = () => {
    if (
      selectedAnswers[currentIndex] !== undefined &&
      currentIndex < questions.length - 1
    ) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer - 1) {
        correctCount++;
      }
    });
    return (correctCount / questions.length) * 100; // Return score instead of setting state
  };

  const handleSubmit = async () => {
    setSubmissionStatus("submitting");
    try {
      const userId = localStorage.getItem("userid");
      console.log("User ID from local storage:", userId); // Add this line
      if (!userId) {
        console.error("User ID not found in local storage");
        setSubmissionStatus("error");
        return;
      }

      const finalScore = calculateScore();
      setScore(finalScore);

      const submissionData = {
        userId: userId,
        examId: examId,
        answers: selectedAnswers,
        score: finalScore,
      };

      const response = await axios.post(
        "http://localhost:5005/submit-exam",
        submissionData
      );
      console.log("Submission Response:", response.data);
      setSubmissionStatus("success");
    } catch (error) {
      console.error("Error submitting exam:", error);
      setSubmissionStatus("error");
    }
  };
  console.log(localStorage.getItem("userid"));

  if (loading) {
    return <div className="text-center text-lg font-bold p-5">Loading...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="text-center text-lg font-bold p-5">
        No questions found for this exam.
      </div>
    );
  }

  if (currentIndex < 0 || currentIndex >= questions.length) {
    return (
      <div className="text-center text-lg font-bold p-5">
        Exam Finished or Invalid State
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main exam content */}
          <div className="p-6 bg-white rounded-lg shadow-md lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Exam </h1>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-lg font-semibold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {score === null ? (
              <>
                <h2 className="text-xl font-bold mb-4 ">
                  {currentIndex + 1}. {currentQuestion.question}
                </h2>
                <ul>
                  {currentQuestion.options.map((option, index) => (
                    <li
                      key={index}
                      className={`p-3 border rounded my-2 cursor-pointer transition duration-300  ${
                        selectedAnswers[currentIndex] === index
                          ? "bg-blue-400 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => handleSelect(index)}
                    >
                      <span
                        className={`mr-2 ${
                          selectedAnswers[currentIndex] === index
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {index + 1}.
                      </span>
                      {option}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`px-4 py-2 rounded ${
                      currentIndex === 0
                        ? "bg-gray-400"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    Previous
                  </button>
                  <div className={`text-lg font-bold text-green-500`}>
                    Question
                    <span className="ml-2">
                      {currentIndex + 1}/{questions.length}
                    </span>
                  </div>
                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      disabled={selectedAnswers[currentIndex] === undefined}
                      className={`px-4 py-2 rounded ${
                        selectedAnswers[currentIndex] === undefined
                          ? "bg-gray-400"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      disabled={submissionStatus === "submitting"}
                    >
                      {submissionStatus === "submitting"
                        ? "Submitting..."
                        : "Submit"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-xl font-bold text-green-600">
                Your Score: {score?.toFixed(2)}/100
              </div>
            )}

            {submissionStatus === "success" && (
              <div className="text-center text-green-500 mt-4">
                Exam submitted successfully!
              </div>
            )}
            {submissionStatus === "error" && (
              <div className="text-center text-red-500 mt-4">
                Error submitting exam. Please try again.
              </div>
            )}
          </div>

          {/* Webcam feed only */}
            {/* <div className="space-y-4 lg:col-span-1">
              <div className="p-4 bg-white rounded-lg shadow-md">
                <Webcam
                  ref={webcamRef}
                  className="w-full rounded-lg"
                  mirrored
                  screenshotFormat="image/jpeg"
                  audio={false}
                  videoConstraints={{
                    width: 480,
                    height: 360,
                    facingMode: "user"
                  }}
                />
                <p className="mt-2 text-sm text-center text-gray-500">Webcam feed (no face detection)</p>
              </div>
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default ExamRoom;