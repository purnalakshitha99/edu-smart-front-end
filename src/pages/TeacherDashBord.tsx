import React, { useState } from "react";
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

interface TeacherDashBordProps {}

interface StudentEmotion {
  id: number;
  name: string;
  emotion: string;
  time: string;
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

  const sidebarItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <Menu /> },
    { id: "documents", label: "Documents", icon: <FileText /> },
    { id: "reports", label: "Reports", icon: <BarChart2 /> },
    { id: "students", label: "Students", icon: <Users /> },
    { id: "courses", label: "Courses", icon: <BookOpen /> },
    { id: "settings", label: "Settings", icon: <Settings /> },
  ];

  const studentEmotions: StudentEmotion[] = [
    { id: 1, name: "John Doe", emotion: "Happy", time: "2 mins ago" },
    { id: 2, name: "Jane Smith", emotion: "Focused", time: "5 mins ago" },
    { id: 3, name: "Mike Johnson", emotion: "Confused", time: "10 mins ago" },
    { id: 4, name: "Sarah Williams", emotion: "Engaged", time: "15 mins ago" },
  ];

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
            <h2 className="mb-4 text-lg font-semibold">Student Emotions</h2>
            <div className="space-y-4">
              {studentEmotions.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-500">{student.emotion}</p>
                  </div>
                  <span className="text-xs text-gray-400">{student.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-3 col-span-2 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Students
              </h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600">24</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
                Average Engagement
              </h3>
              <p className="mt-2 text-3xl font-bold text-green-600">85%</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
                Active Time
              </h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">45m</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashBord;