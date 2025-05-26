import React, { useState, useEffect, useRef } from "react";
import { Clock, AlertCircle, NotepadText, Captions, CalendarFold } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Exam {
  _id: string;
  name: string;
  time_limit: string;
  num_questions: number;
  subject: string;
  created_at: string;
}

interface ExamCardProps {
  exam: Exam;
  onStart: (id: string) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, onStart }) => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    <h3 className="mb-3 text-xl font-semibold">{exam.name}</h3>
    <div className="mb-4 space-y-2 text-gray-600">
      <div className="flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        <span>Duration:{exam.time_limit}.00</span>
      </div>
      <div className="flex items-center">
        <NotepadText className="w-4 h-4 mr-2" />
        <span>Questions: {exam.num_questions}</span>
      </div>
      <div className="flex items-center">
        <Captions  className="w-4 h-4 mr-2" />
        <span>Subject: {exam.subject}</span>
      </div>
      <div className="flex items-center">
        <CalendarFold  className="w-4 h-4 mr-2" />
        <span>Date: {exam.created_at}</span>
      </div>
    </div>
    <button
      onClick={() => onStart(exam._id)}
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

interface CameraPopupProps {
  show: boolean;
  onClose: () => void;
  onVerification: (username: string, headPose: string) => void;
}

const CameraPopup: React.FC<CameraPopupProps> = ({
  show,
  onClose,
  onVerification,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const getCameraStream = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    if (show) {
      getCameraStream();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [show]);

  const verifyUser = async () => {
    setVerifying(true);
    setVerificationError(null);
    const username = localStorage.getItem("username");

    if (!username) {
      setVerificationError("Username not found. Please log in again.");
      setVerifying(false);
      return;
    }

    if (!stream) {
      setVerificationError("Webcam stream not available");
      setVerifying(false);
      return;
    }

    try {
      const video = videoRef.current;
      if (!video) {
        setVerificationError("Video element not available");
        setVerifying(false);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setVerificationError("Could not get 2D context from canvas");
        setVerifying(false);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataURL = canvas.toDataURL("image/jpeg");

      const formData = new FormData();
      formData.append("username", username);

      // Convert data URL to Blob
      const blob = await (await fetch(imageDataURL)).blob();
      formData.append("image_file", blob, "snapshot.jpg");

      const response = await axios.post(
        "http://localhost:5002/api/face_detection",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Face detection API response:", response.data);
      onVerification(response.data.Username, response.data["Head Pose"]);
      onClose();
    } catch (error) {
      console.error("Face detection API error:", error);
      setVerificationError("Face detection failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Verify Your Identity</h2>
        {verificationError && (
          <div className="text-red-500 mb-4">{verificationError}</div>
        )}
        <div className="mb-4">
          <video ref={videoRef} width="100%" autoPlay muted />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={verifyUser}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            disabled={verifying}
          >
            {verifying ? "Verifying..." : "Verify"}
          </button>
        </div>
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
  const [showCameraPopup, setShowCameraPopup] = useState(false);
  const [verifiedUsername, setVerifiedUsername] = useState<string | null>(null);
  const [headPose, setHeadPose] = useState<string | null>(null);
  const [unauthorizedAccess, setUnauthorizedAccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const API_BASE_URL = "http://127.0.0.1:5005";

  const handleStartExam = (examId: string) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setShowWarning(true);
      return;
    }

    // Find the selected exam from quizzes array
    const exam = quizzes.find((q: Exam) => q._id === examId);
    if (exam) {
      setSelectedExam(exam);
      setSelectedExamId(examId);
      setShowRestrictions(true);
    }
  };

  const handleConfirmStart = () => {
    setShowRestrictions(false);
    setShowCameraPopup(true); // Show camera popup
  };

  const handleCancelStart = () => {
    setShowRestrictions(false);
    setSelectedExamId(null);
  };

  const handleCameraPopupClose = () => {
    setShowCameraPopup(false);
  };

  const handleUserVerification = (username: string, headPose: string) => {
    const loggedInUsername = localStorage.getItem("username");
    
    if (username === 'N/A' || username !== loggedInUsername) {
      setUnauthorizedAccess(true);
      alert('Unauthorized Access: Face verification failed. Please ensure you are the registered user and your face is clearly visible.');
      setShowCameraPopup(false);
      setVerifiedUsername(null);
      setHeadPose(null);
      return;
    }

    setUnauthorizedAccess(false);
    setVerifiedUsername(username);
    setHeadPose(headPose);
    setIsLoading(true);
    setShowCameraPopup(false);

    setTimeout(() => {
      if (selectedExam) {
        Promise.all([
          axios.get("http://localhost:5000/ethical_benchmark", {
            params: { 
              userid: localStorage.getItem("userid"),
              exam_duration: selectedExam.time_limit, // Send exam duration in minutes
              exam_id: selectedExam._id
            },
          }),
          new Promise((resolve) => {
            navigate(`/exam/${selectedExamId}`, { 
              state: { 
                examDuration: selectedExam.time_limit,
                examId: selectedExam._id
              }
            });
            resolve("Navigated to exam");
          }),
        ])
          .then(() => {
            alert(`Face Detected: ${username}, Head Pose: ${headPose}\nExam Duration: ${selectedExam.time_limit} minutes`);
          })
          .catch((error) => {
            console.error("Error during startup:", error);
            alert("Error during startup. Please try again.");
            setVerifiedUsername(null);
            setHeadPose(null);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }, 1000);
  };

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

        {unauthorizedAccess && (
          <div className="p-4 mb-8 border-l-4 border-red-500 bg-red-50">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
              <p className="text-red-700 font-semibold">
                Unauthorized Access: Face verification failed. Please ensure you are the registered user and try again.
              </p>
            </div>
          </div>
        )}

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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((exam, index) => (
            <ExamCard key={index} exam={exam} onStart={handleStartExam} />
          ))}
        </div>
      </div>

      <ExamRestrictions
        show={showRestrictions}
        onCancel={handleCancelStart}
        onConfirm={handleConfirmStart}
      />
      <CameraPopup
        show={showCameraPopup}
        onClose={handleCameraPopupClose}
        onVerification={handleUserVerification}
      />

      <FullScreenLoader isLoading={isLoading} />
    </div>
  );
};

export default Exams;
