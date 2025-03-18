import React, { useState, useEffect, useRef } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Exam {
  _id: string;
  name: string;
  time_limit: string;
  questions: any[]; // Changed to any[] to match the backend
  complete: boolean;
  date: string;
}

interface ExamCardProps {
  exam: Exam;
  onStart: (id: string) => void;
}
const [today, setToday] = useState('');

  useEffect(() => {
    const todayDate = new Date();
    setToday(todayDate.toLocaleDateString()); // e.g., "12/25/2024"
  }, []);
  
const ExamCard: React.FC<ExamCardProps> = ({ exam, onStart }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="mb-3 text-xl font-semibold">{exam.name}</h3>
      <div className="mb-4 space-y-2 text-gray-600">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          <span>Time Limit : {exam.time_limit}</span>
        </div>
        <div>Questions: {exam.questions ? exam.questions.length : 0}</div>{" "}
        {/*Fixed to display it if valid, else zero*/}
        <div>Subject: {exam.name}</div>
        <div>Date: {today}</div>
      </div>
      <button
        onClick={() => onStart(exam._id)}
        className="w-full py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Start Exam
      </button>
    </div>
  );
};

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
  const [exams, setExams] = useState<Exam[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null); // New error state

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
    setVerifiedUsername(username);
    setHeadPose(headPose);
    setIsLoading(true); // Start loading after successful verification
    setShowCameraPopup(false);

    // Proceed with starting the exam and API calls after a delay
    setTimeout(() => {
      Promise.all([
        axios.get("http://localhost:5000/ethical_benchmark", {
          params: { userid: localStorage.getItem("userid") },
        }),
        new Promise((resolve) => {
          navigate(`/exam/${selectedExamId}`);
          resolve("Navigated to exam");
        }),
      ])
        .then(() => {
          alert(`Face Detected: ${username}, Head Pose: ${headPose}`); //Display alert
        })
        .catch((error) => {
          console.error("Error during startup:", error);
          alert("Error during startup. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 3000); //Delay for 3sec
  };

  useEffect(() => {
    console.log("useEffect running");
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:5005/get-qa"); // Replace with your API endpoint for exams

        if (response.status !== 200) {
          throw new Error(
            `Failed to fetch exams. Status code: ${response.status}`
          ); // If response is not 200, throw error
        }

        console.log("response.data", response.data);
        setExams(response.data);
        setFetchError(null); // Clear any previous error
      } catch (error: any) {
        console.error("Error fetching exams:", error);
        setFetchError("Failed to load exams. Please try again later."); // Set error message
      }
    };
    fetchExams();
  }, []);

  console.log("Quizezz", exams);

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

        {/* Display fetch error if any */}
        {fetchError && (
          <div className="p-4 mb-8 border-l-4 border-red-400 bg-red-50">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
              <p className="text-red-700">{fetchError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {exams?.map((exam) => {
            console.log(exam.name);
            return (
              <ExamCard key={exam._id} exam={exam} onStart={handleStartExam} />
            );
          })}
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
