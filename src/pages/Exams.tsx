import React, { useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const ExamCard = ({ exam, onStart }: { exam: Exam; onStart: (id: string) => void }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-xl font-semibold mb-3">{exam.title}</h3>
    <div className="space-y-2 text-gray-600 mb-4">
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
      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
    >
      Start Exam
    </button>
  </div>
);

const Exams = () => {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);

  const handleStartExam = (examId: string) => {
    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices?.getUserMedia) {
      setShowWarning(true);
      return;
    }

    navigate(`/exam/${examId}`);
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Exams</h1>
          <p className="text-lg text-gray-600">
            Select an exam to begin. Make sure your webcam is enabled for proctoring.
          </p>
        </div>

        {showWarning && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-yellow-700">
                Camera access is required to take the exam. Please ensure your browser has camera permissions enabled.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} onStart={handleStartExam} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exams;