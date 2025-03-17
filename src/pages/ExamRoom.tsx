import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Clock } from 'lucide-react';

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
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/exams');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [navigate]);

      return () => {
        clearInterval(timer);
      };
    }
  }, [navigate, examTimeLimit]);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const mockQuestions = [
    {
      id: 1,
      question: "What is the primary purpose of React's useEffect hook?",
      options: [
        "To handle side effects in functional components",
        "To create new components",
        "To style components",
        "To handle routing"
      ]
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
              <h1 className="text-2xl font-bold">Exam #{name}</h1>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {mockQuestions.map((q) => (
              <div key={q.id} className="mb-8">
                <h3 className="mb-4 text-lg font-semibold">{q.question}</h3>
                <div className="space-y-3">
                  {q.options.map((option, idx) => (
                    <label key={idx} className="flex items-center p-3 space-x-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name={`question-${q.id}`} className="w-4 h-4 text-blue-600" />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
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