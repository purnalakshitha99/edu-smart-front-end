import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Exam {
  _id: string;
  name: string; // Changed from 'title' to 'name'
  time_limit: string; // Changed from 'duration' to 'time_limit'
  questions: any[]; // Adjusted type as necessary
  subject: string;
  date: string;
  completed: boolean;
}

interface ExamCardProps {
  exam: Exam;
  onStart: (id: string) => void;
}

const ExamCard: React.FC<ExamCardProps> = (
  { exam: { name, time_limit, _id }, onStart } // Destructure props
) => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    <h3 className="mb-3 text-xl font-semibold">{name}</h3>{" "}
    {/* Use 'name' here */}
    <div className="mb-4 space-y-2 text-gray-600">
      <div className="flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        <span>{time_limit} minutes</span> {/* Use 'time_limit' here */}
      </div>
    </div>
    <button
      onClick={() => onStart(_id)}
      className="w-full py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
    >
      Start Exam
    </button>
  </div>
);

interface ExamRestrictionsProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ExamRestrictions: React.FC<ExamRestrictionsProps> = ({
  show,
  onCancel,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-500 bg-opacity-75">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Exam Restrictions</h2>
        <p className="text-gray-700 mb-4">
          Please acknowledge the following restrictions before starting the
          exam:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>No external websites or resources allowed.</li>
          <li>Do not use any unauthorized materials.</li>
          <li>Ensure your face is clearly visible on the webcam.</li>
          <li>Do not talk or communicate with others during the exam.</li>
        </ul>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 mr-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

const FullScreenLoader = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-100 bg-opacity-50 z-50">
      <div className="text-3xl font-bold text-blue-600">
        Loading...
        <div className="inline-block w-8 h-8 ml-4 border-4 border-t-blue-700 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

const Exams: React.FC = () => {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5005/get-qa"); // Assuming this route returns your exam data
        console.log("Fetched Exams data:", response.data);

        if (response.data && Array.isArray(response.data)) {
          //   Filter to display only not completed exams
          const incompleteExams = response.data.filter(
            (exam: Exam) => !exam.completed
          );
          setExams(incompleteExams);
        } else {
          console.warn("Data was either nonexistent or not an array format.");
        }
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStartExam = (examId: string) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setShowWarning(true);
      return;
    }

    setSelectedExamId(examId);
    setShowRestrictions(true);
  };

  const handleConfirmStart = () => {
    setShowRestrictions(false);
    setIsLoading(true);

    setTimeout(() => {
      navigate(`/exam/${selectedExamId}`);
      setIsLoading(false);
    }, 3000);

    const userid = localStorage.getItem("userid"); // Get userId from localStorage

    axios
      .get("http://localhost:5000/ethical_benchmark", {
        params: { userid }, // Send userId as a query parameter
      })
      .then(() => {
        // Optional: Handle success
      })
      .catch((error) => {
        console.error("Failed to start ethical benchmark:", error);
      });
  };

  const handleCancelStart = () => {
    setShowRestrictions(false);
    setSelectedExamId(null);
  };

  return (
    <div className="py-12 min-h-screen ">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Available Exams
          </h1>
          <p className="text-lg text-gray-600">
            Select an exam to begin. Make sure your webcam is enabled for
            proctoring.
          </p>
        </div>

        {showWarning && (
          <div className="p-4 mb-8 border-l-4 border-yellow-400 bg-yellow-50">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
              <p className="text-yellow-700">
                Camera access is required to take the exam. Please ensure your
                browser has camera permissions enabled.
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <FullScreenLoader isLoading={isLoading} />
        ) : exams.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <ExamCard key={exam._id} exam={exam} onStart={handleStartExam} />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-600">
              No exams available at this time.
            </p>
          </div>
        )}
      </div>

      <ExamRestrictions
        show={showRestrictions}
        onCancel={handleCancelStart}
        onConfirm={handleConfirmStart}
      />

      <FullScreenLoader isLoading={isLoading} />
    </div>
  );
};

export default Exams;
