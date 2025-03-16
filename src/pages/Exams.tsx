import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Exam {
    id: string;
    title: string;
    duration: string;
    questions: number;
    subject: string;
    date: string;
}

const exams: Exam[] = [
    {
        id: '1',
        title: 'JavaScript Fundamentals',
        duration: '60 minutes',
        questions: 40,
        subject: 'Programming',
        date: '2024-03-25 10:00 AM'
    },
    {
        id: '2',
        title: 'React Advanced Concepts',
        duration: '90 minutes',
        questions: 50,
        subject: 'Web Development',
        date: '2024-03-26 2:00 PM'
    },
    {
        id: '3',
        title: 'Data Structures & Algorithms',
        duration: '120 minutes',
        questions: 60,
        subject: 'Computer Science',
        date: '2024-03-27 9:00 AM'
    }
];

interface ExamCardProps {
    exam: Exam;
    onStart: (id: string) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, onStart }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="mb-3 text-xl font-semibold">{exam.title}</h3>
        <div className="mb-4 space-y-2 text-gray-600">
            <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{exam.duration}</span>
            </div>
            <div>Questions: {exam.questions}</div>
            <div>Subject: {exam.subject}</div>
            <div>Date: {exam.date}</div>
        </div>
        <button
            onClick={() => onStart(exam.id)}
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

const ExamRestrictions: React.FC<ExamRestrictionsProps> = ({ show, onCancel, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-500 bg-opacity-75">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-semibold mb-4">Exam Restrictions</h2>
                <p className="text-gray-700 mb-4">Please acknowledge the following restrictions before starting the exam:</p>
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
    const [isLoading, setIsLoading] = useState(false); // Loading state එක

    const handleStartExam = (examId: string) => {
        if (!navigator.mediaDevices?.getUserMedia) {
            setShowWarning(true);
            return;
        }

        setSelectedExamId(examId);
        setShowRestrictions(true);
    };

    // const handleConfirmStart = () => {
    //     setShowRestrictions(false);
    //     setIsLoading(true); // Loading state එක true කරන්න
    
    //     // තත්පර 3ක delay එකක් දෙන්න
    //     setTimeout(() => {
    //         navigate(`/exam/${selectedExamId}`);
    //         setIsLoading(false); // Loading state එක false කරන්න
    //     }, 3000); // 3000 milliseconds = 3 seconds
    
    //     axios.get('http://localhost:5000/ethical_benchmark')
    //         .then(() => {
    //             // Optional: Do something after ethical benchmark
    //         })
    //         .catch(error => {
    //             console.error("Failed to start ethical benchmark:", error);
    //             // Optional: Handle error
    //         });
    // };

    const handleConfirmStart = () => {
        setShowRestrictions(false);
        setIsLoading(true);
    
        setTimeout(() => {
            navigate(`/exam/${selectedExamId}`);
            setIsLoading(false);
        }, 3000);
    
        const userid = localStorage.getItem("userid"); // Get userId from localStorage
        const username = localStorage.getItem("username"); // Ensure username is stored in localStorage

      
    
        axios.get('http://localhost:5000/ethical_benchmark', {
            params: { userid } // Send userId as a query parameter
        })
        .then(async () => {
            if (!username) {
                alert("Username not found. Please log in again.");
                setIsLoading(false);
                return;
            }
    
            // Capture image from webcam
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement("video");
            video.srcObject = stream;
            await new Promise((resolve) => (video.onloadedmetadata = resolve));
            video.play();

            // Capture snapshot
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.srcObject.getTracks().forEach(track => track.stop());

        // Convert image to Blob
        canvas.toBlob(async (blob) => {
            if (!blob) {
                alert("Failed to capture image.");
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("username", username);
            formData.append("image_file", blob, "snapshot.jpg");

            try {
                // Call Face Detection API
                const faceResponse = await axios.post("http://localhost:5002/api/face_detection", formData);
                console.log("Face Detection Response:", faceResponse.data);

                alert(`Face Detected: ${faceResponse.data.Username}, Head Pose: ${faceResponse.data["Head Pose"]}`);

                // Navigate to the exam page
                setTimeout(() => {
                    navigate(`/exam/${selectedExamId}`);
                    setIsLoading(false);
                }, 3000);
            } catch (error) {
                console.error("Face detection failed:", error);
                alert("Error in face verification. Please try again.");
                setIsLoading(false);
            }
        }, "image/jpeg");
        })
        .catch(error => {
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
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">Available Exams</h1>
                    <p className="text-lg text-gray-600">
                        Select an exam to begin. Make sure your webcam is enabled for proctoring.
                    </p>
                </div>

                {showWarning && (
                    <div className="p-4 mb-8 border-l-4 border-yellow-400 bg-yellow-50">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
                            <p className="text-yellow-700">
                                Camera access is required to take the exam. Please ensure your browser has camera permissions enabled.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {exams.map((exam) => (
                        <ExamCard key={exam.id} exam={exam} onStart={handleStartExam} />
                    ))}
                </div>
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