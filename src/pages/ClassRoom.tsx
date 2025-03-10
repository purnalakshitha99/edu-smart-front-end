import React from "react";
import { Bell, AlertCircle, Video, Mic, Phone } from "lucide-react";

const Card = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

const ClassRoom = () => {
  return (
    <div className="flex h-screen p-4 bg-blue-50">
      {/* Left Side - Online Classroom */}
      <div className="flex flex-col items-center flex-1 p-6 bg-white shadow-lg rounded-xl">
        <h2 className="mb-4 text-lg font-semibold">Matching Learning Class</h2>
        <div className="relative w-full max-w-lg overflow-hidden bg-gray-200 rounded-lg h-96">
          {/* Using placeholder images since real paths won't work */}
          <img src="/api/placeholder/800/600" alt="Teacher" className="object-cover w-full h-full" />
          <div className="absolute space-y-2 top-4 right-4">
            <img src="/api/placeholder/48/48" alt="Student 1" className="w-12 h-12 border-2 border-white rounded-full" />
            <img src="/api/placeholder/48/48" alt="Student 2" className="w-12 h-12 border-2 border-white rounded-full" />
            <img src="/api/placeholder/48/48" alt="Student 3" className="w-12 h-12 border-2 border-white rounded-full" />
          </div>
        </div>
        <div className="flex mt-4 space-x-4">
          <button className="p-3 text-white bg-red-500 rounded-full"><Phone /></button>
          <button className="p-3 text-white bg-blue-500 rounded-full"><Video /></button>
          <button className="p-3 text-white bg-green-500 rounded-full"><Mic /></button>
        </div>
      </div>

      {/* Right Side - Notifications & Warnings */}
      <div className="flex flex-col w-1/3 ml-4 space-y-4">
        {/* Notifications */}
        <Card>
          <CardContent>
            <h3 className="mb-2 font-semibold text-md">Notifications</h3>
            <div className="flex items-center p-2 space-x-2 bg-gray-100 rounded-lg">
              <Bell className="text-blue-500" />
              <span>New lesson available: 'Illustrator Basics'</span>
            </div>
            <div className="flex items-center p-2 mt-2 space-x-2 bg-gray-100 rounded-lg">
              <Bell className="text-blue-500" />
              <span>Quiz deadline extended</span>
            </div>
          </CardContent>
        </Card>

        {/* Warnings */}
        <Card>
          <CardContent>
            <h3 className="mb-2 font-semibold text-md">Warnings</h3>
            <div className="flex items-center p-2 space-x-2 text-red-600 bg-red-100 rounded-lg">
              <AlertCircle />
              <span>Low engagement detected</span>
            </div>
            <div className="flex items-center p-2 mt-2 space-x-2 text-yellow-600 bg-yellow-100 rounded-lg">
              <AlertCircle />
              <span>Student inactive for 10 minutes</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ClassRoom;