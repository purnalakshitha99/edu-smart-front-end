import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { Clock } from "lucide-react";

import Exam from "./Exam";

const ExamRoom = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const [timeLeft, setTimeLeft] = useState(0); // Initialized to 0
  const [quizName, setQuizName] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [examTimeLimit, setExamTimeLimit] = useState(0); //Added new attribute

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5005/get-qa");
        const data = await response.json();

        console.log("Fetched data:", data);

        if (data && Array.isArray(data) && data.length > 0) {
          const firstQuiz = data[0]; // Get the first quiz
          setQuizzes(data);
          setQuestions(firstQuiz.questions);
          setQuizName(firstQuiz.name);
          const durationInMinutes = firstQuiz.time_limit; // Duration should be in minutes

          // Convert duration to seconds
          const durationInSeconds = durationInMinutes * 60;
          setTimeLeft(durationInSeconds);
          setExamTimeLimit(durationInSeconds);
        } else {
          console.warn("No quizzes found or invalid data format.");
          setQuestions([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Timer countdown only
    let timer: NodeJS.Timeout;
    if (examTimeLimit > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/exams");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [navigate, examTimeLimit]);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main exam content */}
          <div className="p-6 bg-white rounded-lg shadow-md lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Exam #{name}</h1>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-lg font-semibold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <Exam // Changed to ExamComponent
              quizName={quizName}
              quizzes={quizzes}
              questions={questions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamRoom;
