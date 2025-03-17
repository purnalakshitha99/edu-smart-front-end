import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ExamProps {
  quizName: string;
  quizzes: any[];
  questions: any[];
}

const Exam: React.FC<ExamProps> = ({ quizName, quizzes, questions }) => {
  // Receive props
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log("Received quizName:", quizName); // Check the received value
    console.log("Received quizzes:", quizzes); // Check the received value
    console.log("Received questions:", questions); // Check the received value
  }, [quizName, quizzes, questions]);

  const handleNext = () => {
    if (selectedAnswers[currentIndex] !== undefined) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleSelect = (index) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: index });
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer - 1) {
        correctCount++;
      }
    });
    setScore((correctCount / questions.length) * 100);
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    console.log("Submitting quiz with name:", quizName);
    try {
      const response = await fetch("http://localhost:5005/complete-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quizName: quizName }),
      });

      if (response.ok) {
        console.log("Quiz completion status updated");
        setIsComplete(true);
      } else {
        console.error("Failed to update quiz completion status");
      }
    } catch (error) {
      console.error("Error updating quiz completion status:", error);
    }
  };

  if (questions.length === 0) {
    return <div className="text-center text-lg font-bold p-5">Loading...</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg shadow-lg">
      {score === null ? (
        <>
          {currentQuestion ? (
            <>
              <h2 className="text-xl font-bold mb-4 ">
                {currentIndex + 1}.{currentQuestion.question}
              </h2>
              <ul>
                {currentQuestion.options &&
                Array.isArray(currentQuestion.options) ? (
                  currentQuestion.options.map((option, index) => (
                    <li
                      key={index}
                      className={`p-3 border rounded my-2 cursor-pointer transition duration-300  ${
                        selectedAnswers[currentIndex] === index
                          ? "bg-blue-400 text-white"
                          : ""
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
                  ))
                ) : (
                  <li>No Options Available</li>
                )}
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
                    onClick={calculateScore}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Submit
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-lg font-bold p-5">
              No question to display
            </div>
          )}
        </>
      ) : (
        <div className=" flex justify-center items-center flex-col">
          <div className="text-center text-xl font-bold text-green-600">
            You Complete Your Exam!!
          </div>
          <div className="text-center text-xl font-bold text-green-600">
            Your Score: {score.toFixed(2)}%
          </div>
          <Link
            to="/exams"
            className=" mt-10 flex items-center justify-center  p-3 bg-blue-600 text-white text-xl font-bold rounded-lg w-[200px] hover:bg-green-500 cursor-pointer duration-300 hover:text-black"
          >
            Back to home
          </Link>
        </div>
      )}
    </div>
  );
};

export default Exam;
