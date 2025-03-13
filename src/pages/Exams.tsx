import React, { useState } from 'react';
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

const Exams: React.FC = () => {
    const navigate = useNavigate();
    const [showWarning, setShowWarning] = useState(false);
    const [showRestrictions, setShowRestrictions] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

    const handleStartExam = (examId: string) => {
        // Check if browser supports getUserMedia
        if (!navigator.mediaDevices?.getUserMedia) {
            setShowWarning(true);
            return;
        }

        setSelectedExamId(examId);
        setShowRestrictions(true);
    };

    const handleConfirmStart = async () => {
        setShowRestrictions(false);
        try {
            
            const response = await axios.get('http://localhost:5000/ethical_benchmark');

         
            console.log("Ethical benchmark response:", response.data);

            
            navigate(`/exam/${selectedExamId}`);
        } catch (error) {
            console.error("Failed to start ethical benchmark:", error);
            
        }
    };

    const handleCancelStart = () => {
        setShowRestrictions(false);
        setSelectedExamId(null);
    };

    return (
        <div className="py-12">
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

            {/* Exam Restrictions Popup */}
            {showRestrictions && (
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
                                onClick={handleCancelStart}
                                className="px-4 py-2 mr-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmStart}
                                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Start Exam
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exams;