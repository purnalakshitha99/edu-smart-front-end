import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Clock,
  BookOpen,
  Hash,
  Calendar,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  List,
  X,
  RefreshCw,
  Download,
  Trash2,
} from "lucide-react";

const FileUpload = () => {
  // Form state
  const [file, setFile] = useState(null);
  const [examName, setExamName] = useState("");
  const [subject, setSubject] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(60);
  const [examDate, setExamDate] = useState("");

  const navigate = useNavigate();

  const [qaPairs, setQaPairs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [generationStatus, setGenerationStatus] = useState("");
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [showSavedQuizzes, setShowSavedQuizzes] = useState(false);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const API_BASE_URL = "http://127.0.0.1:5005";
  const MAX_FILE_SIZE = 16 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = [".pdf"];

  useEffect(() => {
    loadSavedQuizzes();
  }, []);

  useEffect(() => {
    if (qaPairs.length > 0) {
      const draftData = {
        examName,
        subject,
        noOfQuestions,
        timeLimit,
        examDate,
        qaPairs,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("examDraft", JSON.stringify(draftData));
    }
  }, [qaPairs, examName, subject, noOfQuestions, timeLimit, examDate]);

  useEffect(() => {
    const savedDraft = localStorage.getItem("examDraft");
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        const isRecent =
          new Date() - new Date(draft.timestamp) < 24 * 60 * 60 * 1000;

        if (isRecent && draft.qaPairs && draft.qaPairs.length > 0) {
          const shouldRestore = window.confirm(
            "Found a recent draft. Would you like to restore it?"
          );
          if (shouldRestore) {
            setExamName(draft.examName || "");
            setSubject(draft.subject || "");
            setNoOfQuestions(draft.noOfQuestions || 10);
            setTimeLimit(draft.timeLimit || 60);
            setExamDate(draft.examDate || "");
            setQaPairs(draft.qaPairs || []);
            setShowPreview(true);
          }
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, []);

  const loadSavedQuizzes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-qa`, {
        credentials: "include",
        mode: "cors",
      });
      if (response.ok) {
        const data = await response.json();
        setSavedQuizzes(data.quizzes || []);
      }
    } catch (error) {
      console.error("Error loading saved quizzes:", error);
    }
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};

    if (!examName.trim()) errors.examName = "Exam name is required";
    if (examName.length > 100)
      errors.examName = "Exam name too long (max 100 characters)";

    if (!subject.trim()) errors.subject = "Subject is required";
    if (subject.length > 50)
      errors.subject = "Subject name too long (max 50 characters)";

    if (!noOfQuestions || noOfQuestions < 1 || noOfQuestions > 50) {
      errors.noOfQuestions = "Number of questions must be between 1 and 50";
    }

    if (!timeLimit || timeLimit < 1 || timeLimit > 300) {
      errors.timeLimit = "Time limit must be between 1 and 300 minutes";
    }

    if (!file) errors.file = "Please select a PDF file";

    if (examDate) {
      const selectedDate = new Date(examDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.examDate = "Exam date cannot be in the past";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [examName, subject, noOfQuestions, timeLimit, file, examDate]);

  const validateFile = useCallback((selectedFile) => {
    if (!selectedFile) return "No file selected";

    const fileExtension =
      "." + selectedFile.name.split(".").pop().toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
      return "Only PDF files are supported";
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }

    if (selectedFile.name.includes("#") || selectedFile.name.includes("?")) {
      return "Please rename the file to remove special characters";
    }

    return null;
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      const selectedFile = e.target.files[0];
      const fileError = validateFile(selectedFile);

      if (fileError) {
        setError(fileError);
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setValidationErrors((prev) => ({ ...prev, file: null }));
    },
    [validateFile]
  );

  const handleInputChange = useCallback(
    (field, value) => {
      switch (field) {
        case "examName":
          setExamName(value);
          break;
        case "subject":
          setSubject(value);
          break;
        case "noOfQuestions": {
          const questions = Math.max(1, Math.min(50, parseInt(value) || 0));
          setNoOfQuestions(questions);
          if (qaPairs.length > questions) {
            setQaPairs((prev) => prev.slice(0, questions));
          }
          break;
        }
        case "timeLimit":
          setTimeLimit(Math.max(1, Math.min(300, parseInt(value) || 0)));
          break;
        case "examDate":
          setExamDate(value);
          break;
      }
      setValidationErrors((prev) => ({ ...prev, [field]: null }));
    },
    [qaPairs.length]
  );

  const processStreamResponse = useCallback((rawData) => {
    try {
      let cleanData = rawData.trim();

      if (cleanData.startsWith("data: ")) {
        cleanData = cleanData.substring(6);
      }

      if (cleanData.includes('{"') && !cleanData.endsWith("}")) {
        console.warn("Potentially truncated JSON detected:", cleanData);
        return [];
      }

      const parsedObject = JSON.parse(cleanData);

      if (parsedObject && typeof parsedObject === "object") {
        if (
          !parsedObject.question &&
          !parsedObject.error &&
          !parsedObject.status
        ) {
          console.warn("Invalid QA object received:", parsedObject);
          return [];
        }
        return Array.isArray(parsedObject) ? parsedObject : [parsedObject];
      }

      return [];
    } catch (error) {
      console.error("Error parsing response data:", error);
      console.error("Raw data:", rawData);
      return [];
    }
  }, []);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setProgress(0);
    setGenerationStatus("");
  }, []);

  const clearForm = useCallback(() => {
    setQaPairs([]);
    setExamName("");
    setSubject("");
    setNoOfQuestions(10);
    setTimeLimit(60);
    setExamDate("");
    setFile(null);
    setError(null);
    setValidationErrors({});
    setProgress(0);
    setSelectedOption(null);
    setShowPreview(false);
    setGenerationStatus("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    localStorage.removeItem("examDraft");
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      if (!validateForm()) {
        setError("Please fix the validation errors before submitting.");
        return;
      }

      abortControllerRef.current = new AbortController();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("noOfQuestions", noOfQuestions.toString());

      try {
        setLoading(true);
        setError(null);
        setQaPairs([]);
        setProgress(0);
        setGenerationStatus("Preparing to process document...");

        const response = await fetch(`${API_BASE_URL}/generate-qa`, {
          method: "POST",
          body: formData,
          credentials: "include",
          mode: "cors",
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Server error: ${response.status}`
          );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let questionCount = 0;
        let hasErrors = false;

        setGenerationStatus("Processing document and generating questions...");

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim() && line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim();

              if (dataStr.includes('"status": "complete"')) {
                setProgress(100);
                setGenerationStatus("Generation completed successfully!");
                break;
              }

              if (dataStr.includes('"error"')) {
                hasErrors = true;
                try {
                  const errorObj = JSON.parse(dataStr);
                  setError(
                    errorObj.error || "An error occurred during generation"
                  );
                } catch {
                  setError("An unknown error occurred during generation");
                }
                continue;
              }

              const qaArray = processStreamResponse(dataStr);

              if (qaArray.length > 0) {
                questionCount++;
                setQaPairs((prev) => {
                  const newQAs = [...prev, ...qaArray];
                  return newQAs.slice(0, noOfQuestions);
                });

                const progressPercent = Math.min(
                  (questionCount / noOfQuestions) * 100,
                  95
                );
                setProgress(progressPercent);
                setGenerationStatus(
                  `Generated ${questionCount} of ${noOfQuestions} questions...`
                );
              }
            }
          }
        }

        if (!hasErrors && questionCount === 0) {
          throw new Error(
            "No questions were generated. Please check your PDF content."
          );
        }
      } catch (err) {
        if (err.name === "AbortError") {
          setError("Generation was cancelled.");
          setGenerationStatus("Generation cancelled");
        } else {
          console.error("File upload failed:", err);
          setError(
            err.message || "An error occurred while processing the file."
          );
          setGenerationStatus("Generation failed");
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [file, noOfQuestions, validateForm, processStreamResponse]
  );

  const handleSave = useCallback(async () => {
    if (qaPairs.length === 0) {
      setError("No questions to save. Please generate questions first.");
      return;
    }

    try {
      setLoading(true);

      const selectedQuestions = qaPairs.slice(0, parseInt(noOfQuestions) || 10);

      const qaObject = {
        name: examName.trim(),
        subject: subject.trim(),
        time_limit: parseInt(timeLimit),
        num_questions: parseInt(noOfQuestions),
        questions: selectedQuestions,
        created_at: examDate || new Date().toISOString(),
        metadata: {
          file_name: file?.name,
          file_size: file?.size,
          generated_at: new Date().toISOString(),
        },
      };

      const response = await fetch(`${API_BASE_URL}/save-qa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(qaObject),
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save exam");
      }

      const data = await response.json();
      console.log("Exam saved successfully:", data);

      clearForm();

      await loadSavedQuizzes();

      alert("Exam saved successfully!");
    } catch (err) {
      console.error("Failed to save exam:", err);
      setError(err.message || "An error occurred while saving the exam.");
    } finally {
      setLoading(false);
    }
  }, [
    qaPairs,
    noOfQuestions,
    examName,
    subject,
    timeLimit,
    examDate,
    file,
    clearForm,
    loadSavedQuizzes,
  ]);

  const exportQuestions = useCallback(() => {
    if (qaPairs.length === 0) return;

    const exportData = {
      examName,
      subject,
      timeLimit,
      questions: qaPairs.slice(0, noOfQuestions),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${examName || "exam"}_questions.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [qaPairs, examName, subject, timeLimit, noOfQuestions]);

  const deleteQuestion = useCallback((index) => {
    setQaPairs((prev) => prev.filter((_, i) => i !== index));
    setSelectedOption(null);
  }, []);

  const renderQAItem = useCallback(
    (qa, index) => {
      if (!qa || !qa.question) return null;

      return (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex-1">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mr-3">
                {index + 1}
              </span>
              {qa.question}
            </h3>
          </div>

          {qa.options && qa.options.length > 0 && (
            <div className="space-y-3">
              {qa.options.map((option, optionIndex) => {
                const isSelected =
                  selectedOption?.question === index &&
                  selectedOption?.answer === optionIndex;
                const isCorrect = optionIndex === qa.answer - 1;

                return (
                  <label
                    key={optionIndex}
                    className={`flex items-center p-3 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? isCorrect
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={optionIndex}
                      checked={isSelected}
                      onChange={() =>
                        setSelectedOption({
                          question: index,
                          answer: optionIndex,
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {String.fromCharCode(65 + optionIndex)}. {option}
                    </span>
                    {isSelected && isCorrect && (
                      <CheckCircle className="ml-auto w-5 h-5 text-green-600" />
                    )}
                    {isSelected && !isCorrect && (
                      <AlertCircle className="ml-auto w-5 h-5 text-red-600" />
                    )}
                  </label>
                );
              })}
            </div>
          )}

          {qa.explanation && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                Explanation:
              </h4>
              <p className="text-sm text-blue-700">{qa.explanation}</p>
            </div>
          )}
        </div>
      );
    },
    [selectedOption]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Question Generator
              </h1>
              <button
                onClick={() => navigate("/quizess")}
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <List className="w-4 h-4 mr-2" />
                View All Quizzes
              </button>
            </div>
            <p className="text-gray-600">
              Upload a PDF document to automatically generate questions and
              answers
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Exam Name
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) =>
                    handleInputChange("examName", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.examName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter exam name"
                />
                {validationErrors.examName && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.examName}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.subject
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter subject"
                />
                {validationErrors.subject && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.subject}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Hash className="w-4 h-4 mr-2" />
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={noOfQuestions}
                  onChange={(e) =>
                    handleInputChange("noOfQuestions", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.noOfQuestions
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.noOfQuestions && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.noOfQuestions}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={timeLimit}
                  onChange={(e) =>
                    handleInputChange("timeLimit", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.timeLimit
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.timeLimit && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.timeLimit}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Exam Date (Optional)
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => handleInputChange("examDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4 mr-2" />
                Upload PDF Document
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  validationErrors.file
                    ? "border-red-300 bg-red-50"
                    : file
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF files only, max 16MB
                  </p>
                </label>
              </div>
              {validationErrors.file && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.file}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Questions
                  </>
                )}
              </button>
            </div>
          </div>

          {loading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {qaPairs.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Generated Questions ({qaPairs.length})
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {showPreview ? (
                      <EyeOff className="w-4 h-4 mr-2" />
                    ) : (
                      <Eye className="w-4 h-4 mr-2" />
                    )}
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Exam
                  </button>
                </div>
              </div>

              {showPreview && (
                <div className="space-y-6">
                  {qaPairs
                    .slice(0, noOfQuestions)
                    .map((qa, index) => renderQAItem(qa, index))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
