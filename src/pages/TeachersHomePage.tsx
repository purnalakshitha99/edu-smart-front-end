import React, { useState } from "react";
import { BookOpen, ArrowRight } from "lucide-react";

// Assuming TeacherDashBord is defined elsewhere and properly exported
import TeacherDashBord from "./TeacherDashBord";
import { Link } from "react-router-dom";

interface TeachersHomePageProps {}

const TeachersHomePage: React.FC<TeachersHomePageProps> = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container px-4 py-16 mx-auto">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Side Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 text-blue-700 bg-blue-100 rounded-full">
              <BookOpen className="w-5 h-5 mr-2" />
              <span className="font-medium">Welcome to EduTeach</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              Empower Your Teaching Journey with Modern Tools
            </h1>

            <p className="text-lg text-gray-600">
              Transform your teaching experience with our comprehensive
              e-learning platform. Create engaging content, track student
              progress, and foster a dynamic learning environment.
            </p>

            <Link
      to="/teacherdashbord"
      className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
    >
      Start Teaching
      <ArrowRight className="w-5 h-5 ml-2" />
    </Link>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-blue-600">10k+</h3>
                <p className="text-gray-600">Active Teachers</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-blue-600">50k+</h3>
                <p className="text-gray-600">Students</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-blue-600">200+</h3>
                <p className="text-gray-600">Courses</p>
              </div>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
              alt="Teacher using digital tools"
              className="object-cover w-full shadow-2xl rounded-2xl"
              style={{ height: "600px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachersHomePage;