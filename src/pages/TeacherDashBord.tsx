// TeacherDashBord.tsx
import React, { useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { database, ref, onValue, set } from "../firebase"; // Make sure this points to the correct firebase.ts file

import {
  Menu,
  FileText,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  BookOpen,
  Bell,
  Video,
  VideoOff,
  Mic,
  MicOff,
} from "lucide-react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

interface TeacherDashBordProps {}

interface StudentEmotion {
  student_id: string;
  username: string;
  emotion: string | null;
  timestamp: string | null;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const TeacherDashBord: React.FC<TeacherDashBordProps> = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [studentEmotions, setStudentEmotions] = useState<StudentEmotion[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(
    localStorage.getItem("userId")
  );

  // State to store emotion from localStorage
  const [emotion, setEmotion] = useState<string | null>(() => {
    // Retrieve emotion from localStorage when the component first mounts
    const savedEmotion = localStorage.getItem("emotion");
    return savedEmotion ? savedEmotion : null;
  });

  // Set up an effect to update emotion whenever localStorage changes
  useEffect(() => {
    // Create an event listener for changes in localStorage
    const handleStorageChange = () => {
      const savedEmotion = localStorage.getItem("emotion");
      if (savedEmotion) {
        setEmotion(savedEmotion); // Update state when localStorage changes
      }
    };

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const sidebarItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <Menu /> },
    { id: "documents", label: "Documents", icon: <FileText /> },
    { id: "reports", label: "Reports", icon: <BarChart2 /> },
    { id: "students", label: "Students", icon: <Users /> },
    { id: "courses", label: "Courses", icon: <BookOpen /> },
    { id: "settings", label: "Settings", icon: <Settings /> },
  ];
  //Add useCallback, This function fetches initial emotion data from the API. It takes a token as an argument and handles setting the loading state and updating the studentEmotions state.
  const fetchInitialEmotionData = useCallback(
    async (token: string) => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5003/api/all_student_emotions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Initial emotion data:", response.data);
          setStudentEmotions(response.data);
        }
      } catch (error) {
        console.error("Error fetching initial emotion data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setStudentEmotions, setIsLoading]
  );

  //Add initial fetch and setup socket
  useEffect(() => {
    // Fetch the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    // Now both initial fetch and socket depend on token so do this.
    fetchInitialEmotionData(token);

    // Now set up socket connection
    const newSocket: Socket = io("http://localhost:5003", {
      auth: {
        token: token,
      },
    });
    newSocket.on("connect", () => {
      console.log("Socket connected");
      setSocketConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocketConnected(false);
    });

    newSocket.on("emotion_data", (data) => {
      console.log("New emotion data:", data);

      // Update student emotion in state with new data by studentId
      setStudentEmotions((prevStudentEmotions) => {
        // Check if the student already exists in the list
        const studentIndex = prevStudentEmotions.findIndex(
          (student) => student.student_id === data.student_id
        );

        if (studentIndex !== -1) {
          // If student exists, update the student's emotion
          const updatedStudentEmotions = [...prevStudentEmotions];
          updatedStudentEmotions[studentIndex] = {
            ...updatedStudentEmotions[studentIndex],
            emotion: data.emotion,
            timestamp: data.timestamp,
            username: data.username,
          };
          return updatedStudentEmotions;
        } else {
          // If student doesn't exist, add them to the list
          return [...prevStudentEmotions, data];
        }
      });
    });
    setSocket(newSocket);
    // Clean up function when the component unmounts
    return () => {
      console.log("Cleaning up socket...");
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("emotion_data");
      newSocket.disconnect();
      console.log("Socket cleanup complete");
    };
  }, [fetchInitialEmotionData]);

  useEffect(() => {
    const emotionRef = ref(database, "studentEmotions/");
    onValue(emotionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updatedEmotions = Object.keys(data).map((key) => ({
          student_id: key,
          username: data[key].username,
          emotion: data[key].emotion,
          timestamp: data[key].timestamp,
        }));
        setStudentEmotions(updatedEmotions); // Update state with the latest data
      }
    });
  }, []);

  //Helper function to format timestamp

  // Helper function to format timestamps
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "Never";

    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch (e) {
      return "Invalid time";
    }
  };

  // Get emoji for emotion
  const getEmotionEmoji = (emotion: string | null) => {
    if (!emotion) return "❓";

    switch (emotion.toLowerCase()) {
      case "happy":
        return "😊";
      case "sad":
        return "😢";
      case "angry":
        return "😠";
      case "surprised":
        return "😲";
      case "neutral":
        return "😐";
      case "disgust":
        return "🤢";
      case "scared":
        return "😨";
      default:
        return "❓";
    }
  };

  const handleRefresh = () => {
    // Fetch the token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    // Call your fetchInitialEmotionData or its equivalent here
    setIsLoading(true);
    axios
      .get("http://localhost:5003/api/all_student_emotions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Refreshed emotion data:", response.data);
          setStudentEmotions(response.data);
        } else {
          console.error("Failed to refresh emotion data:", response.status);
        }
      })
      .catch((error) => console.error("Error refreshing emotion data:", error))
      .finally(() => setIsLoading(false));
  };

  const countNotFocusedStudents = () => {
    return studentEmotions.filter(
      (s) =>
        s.emotion === "angry" ||
        s.emotion === "disgust" ||
        s.emotion === "scared" ||
        s.emotion === "sad"
    ).length;
  };

  // Function to calculate percentage of not focused students
  const calculateNotFocusedPercentage = () => {
    const totalStudents = studentEmotions.length;
    const notFocusedStudents = countNotFocusedStudents();

    if (totalStudents === 0) return 0; // Avoid division by zero

    return ((notFocusedStudents / totalStudents) * 100).toFixed(2); // Calculate and format percentage
  };

  //--------------------------------
  // Fetch data for the currently logged-in student only
  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentStudentId = localStorage.getItem("userId");

    if (!token || !currentStudentId) {
      console.error("No authentication token found or no student ID");
      return;
    }

    // Function to fetch emotion data for the current student
    const fetchEmotionData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5003/api/student_emotions/${currentStudentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudentEmotions(response.data.emotions); // Set state with only the current student's data
      } catch (error) {
        console.error("Error fetching student emotion data:", error);
      }
    };

    fetchEmotionData();

    return () => {
      setStudentEmotions([]); // Clear the state when the component unmounts or the class ends
    };
  }, [currentStudentId]);

  const handleEndClass = () => {
    // Clear student emotion data from Firebase once class is over
    const emotionRef = ref(database, "studentEmotions/" + currentStudentId);
    set(emotionRef, null); // Remove emotion data for the logged-in student from Firebase
    setStudentEmotions([]); // Clear the state as well
    window.location.href = "/dashboard"; // Redirect to dashboard after class ends
  };
  //----------------------

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-indigo-800 text-white transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {isSidebarOpen && <h2 className="text-xl font-bold">TeacherBoard</h2>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-indigo-700"
          >
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-4 hover:bg-indigo-700 transition-colors
             ${activeTab === item.id ? "bg-indigo-700" : ""}
             ${!isSidebarOpen ? "justify-center" : ""}`}
            >
              <span className="w-6 h-6">{item.icon}</span>
              {isSidebarOpen && <span className="ml-4">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Live Class Monitor
            </h1>
            <div className="flex items-center space-x-4">
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  socketConnected
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {socketConnected ? "Connected" : "Disconnected"}
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Teacher profile"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium text-gray-700">Ms. Anderson</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-6 p-6 h-[calc(100vh-5rem)] overflow-y-auto">
          {/* Camera Feed */}
          <div className="col-span-2 p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Teacher Camera Feed</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-2 rounded-full ${
                    isMicOn
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {isMicOn ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <MicOff className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`p-2 rounded-full ${
                    isCameraOn
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {isCameraOn ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <VideoOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="relative overflow-hidden bg-gray-900 rounded-lg aspect-video">
              {isCameraOn ? (
                <Webcam
                  className="object-cover w-full h-full"
                  mirrored={true}
                  audio={isMicOn}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <VideoOff className="w-16 h-16 text-gray-500" />
                </div>
              )}
            </div>
          </div>

          {/* Student Emotions Panel */}
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Student Emotions</h2>
              <button
                onClick={() =>
                  fetchInitialEmotionData(localStorage.getItem("token") || "")
                }
                className="px-3 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {studentEmotions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No student emotion data available
                </div>
              ) : (
                studentEmotions.map((emotionData) => (
                  <div
                    key={emotionData.student_id}
                    className="flex items-center justify-between p-4 border-l-4 rounded-lg bg-gray-50"
                    style={{
                      borderLeftColor:
                        emotionData.emotion === "happy"
                          ? "#10B981"
                          : emotionData.emotion === "sad"
                          ? "#3B82F6"
                          : emotionData.emotion === "angry"
                          ? "#EF4444"
                          : emotionData.emotion === "surprised"
                          ? "#F59E0B"
                          : emotionData.emotion === "neutral"
                          ? "#6B7280"
                          : "#9CA3AF",
                    }}
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {emotionData.username}{" "}
                        <span className="text-xl">
                          {getEmotionEmoji(emotionData.emotion)}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-500">
                        {emotionData.emotion || "Unknown"}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatTimestamp(emotionData.timestamp)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-3 col-span-2 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Students
              </h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600">
                {studentEmotions.length}
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
                Not Focused Students
              </h3>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {calculateNotFocusedPercentage()}%
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
                Focused Students
              </h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {
                  studentEmotions.filter(
                    (s) => s.emotion === "neutral" || s.emotion === "happy"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashBord;
