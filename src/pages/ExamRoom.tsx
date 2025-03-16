import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { Clock } from "lucide-react";
import Exam from "./Exam";

const ExamRoom = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds

  useEffect(() => {
    // Timer countdown only
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

    return () => {
      clearInterval(timer);
    };
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const mockQuestions = [
    {
      id: 1,
      question: "What is the primary purpose of React's useEffect hook?",
      options: [
        "To handle side effects in functional components",
        "To create new components",
        "To style components",
        "To handle routing",
      ],
    },
    // Add more questions as needed
  ];

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main exam content */}
          <div className="p-6 bg-white rounded-lg shadow-md lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Exam #{examId}</h1>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-lg font-semibold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <Exam />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamRoom;
