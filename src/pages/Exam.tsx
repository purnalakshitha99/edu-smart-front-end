import { useEffect, useState } from "react";

const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5005/get-qa");
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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
  };

  console.log("Questions:", questions);

  if (questions.length === 0) {
    return <div className="text-center text-lg font-bold p-5">Loading...</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg shadow-lg bg-yellow-400">
      {score === null ? (
        <>
          <h2 className="text-xl font-bold mb-4 ">
            {currentIndex + 1}.{currentQuestion.question}
          </h2>
          <ul>
            {currentQuestion.options.map((option, index) => (
              <li
                key={index}
                className={`p-3 border rounded my-2 cursor-pointer transition duration-300  ${
                  selectedAnswers[currentIndex] === index
                    ? "bg-blue-400 text-white"
                    : "bg-gray-200"
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
                  {" "}
                  {index + 1}.
                </span>
                {option}
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded ${
                currentIndex === 0 ? "bg-gray-400" : "bg-blue-500 text-white"
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
        <div className="text-center text-xl font-bold text-green-600">
          Your Score: {score}/100
        </div>
      )}
    </div>
  );
};

export default Exam;
