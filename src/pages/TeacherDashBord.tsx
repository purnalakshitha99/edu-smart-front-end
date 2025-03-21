// TeacherDashBord.tsx
import React, { useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
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
import { io, Socket } from 'socket.io-client';

interface TeacherDashBordProps { }

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

    const sidebarItems: SidebarItem[] = [
        { id: "dashboard", label: "Dashboard", icon: <Menu /> },
        { id: "documents", label: "Documents", icon: <FileText /> },
        { id: "reports", label: "Reports", icon: <BarChart2 /> },
        { id: "students", label: "Students", icon: <Users /> },
        { id: "courses", label: "Courses", icon: <BookOpen /> },
        { id: "settings", label: "Settings", icon: <Settings /> },
    ];
    //Add useCallback, This function fetches initial emotion data from the API. It takes a token as an argument and handles setting the loading state and updating the studentEmotions state.
    const fetchInitialEmotionData = useCallback(async (token: string) => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:5003/api/all_student_emotions', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    console.log("Initial emotion data:", response.data);
                    setStudentEmotions(response.data);
                }
            } catch (error) {
                console.error("Error fetching initial emotion data:", error);
            } finally {
                setIsLoading(false);
            }
    }, [setStudentEmotions, setIsLoading]);

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
                token: token
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
                const studentIndex = prevStudentEmotions.findIndex((student) => student.student_id === data.student_id);

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
            
            switch(emotion.toLowerCase()) {
                case "happy": return "😊";
                case "sad": return "😢";
                case "angry": return "😠";
            case "surprised": return "😲";
            case "neutral": return "😐";
            case "disgust": return "🤢";
            case "scared": return "😨";
            default: return "❓";
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
            .get('http://localhost:5003/api/all_student_emotions', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.status === 200) {
                    console.log("Refreshed emotion data:", response.data);
                    setStudentEmotions(response.data);
                } else {
                    console.error("Failed to refresh emotion data:", response.status);
                }
            })
            .catch(error => console.error("Error refreshing emotion data:", error))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`bg-indigo-800 text-white transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"
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
                            <div className={`px-3 py-1 rounded-full text-sm ${socketConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {socketConnected ? 'Connected' : 'Disconnected'}
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
                                    className={`p-2 rounded-full ${isMicOn
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
                                    className={`p-2 rounded-full ${isCameraOn
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
                                onClick={() => fetchInitialEmotionData(localStorage.getItem("token") || "")}
                                className="px-3 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
                            >
                                Refresh
                            </button>
                        </div>
                        
                        {isLoading ? (
                            <div className="flex items-center justify-center p-8">
                                <div className="w-8 h-8 border-4 border-gray-200 rounded-full border-t-indigo-600 animate-spin"></div>
                            </div>
                        ) : studentEmotions.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No student emotion data available
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                {studentEmotions.map((student) => (
                                    <div
                                        key={student.student_id}
                                        className="flex items-center justify-between p-4 border-l-4 rounded-lg bg-gray-50"
                                        style={{
                                            borderLeftColor: student.emotion === 'happy' ? '#10B981' : 
                                                            student.emotion === 'sad' ? '#3B82F6' :
                                                            student.emotion === 'angry' ? '#EF4444' :
                                                            student.emotion === 'surprised' ? '#F59E0B' :
                                                            student.emotion === 'neutral' ? '#6B7280' : '#9CA3AF'
                                        }}
                                    >
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {student.username} <span className="text-xl">{getEmotionEmoji(student.emotion)}</span>
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {student.emotion || "Unknown"}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {formatTimestamp(student.timestamp)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-3 col-span-2 gap-6">
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Total Students
                            </h3>
                            <p className="mt-2 text-3xl font-bold text-indigo-600">{studentEmotions.length}</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Happy Students
                            </h3>
                            <p className="mt-2 text-3xl font-bold text-green-600">
                                {studentEmotions.filter(s => s.emotion === 'happy').length}
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Focused Students
                            </h3>
                            <p className="mt-2 text-3xl font-bold text-blue-600">
                                {studentEmotions.filter(s => s.emotion === 'neutral' || s.emotion === 'happy').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashBord;