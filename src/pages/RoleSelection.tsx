import React from 'react';
import { GraduationCap, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export function RoleSelection() {
      const navigate = useNavigate(); // ✅ Initialize navigate function
  const handleRoleSelect = (role: 'student' | 'teacher') => {
    // For now, we'll just store the role and show the appropriate auth page
    localStorage.setItem('selectedRole', role);
    navigate(role === 'student' ? '/login' : '/teacherlogin');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/50">
      <div className="w-full max-w-4xl mx-4">
        <h1 className="mb-8 text-4xl font-bold text-center text-gray-900">
          Welcome to Our Learning Platform
        </h1>
        <p className="mb-12 text-xl text-center text-gray-600">
          Please select your role to continue
        </p>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Student Card */}
          <button
            onClick={() => handleRoleSelect('student')}
            className="p-8 transition-all bg-white shadow-lg rounded-xl hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-20 h-20 mb-4 bg-blue-100 rounded-full">
                <GraduationCap size={40} className="text-blue-600" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">I'm a Student</h2>
              <p className="text-center text-gray-600">
                Access your learning materials, assignments, and connect with teachers
              </p>
            </div>
          </button>

          {/* Teacher Card */}
          <button
            onClick={() => handleRoleSelect('teacher')}
            className="p-8 transition-all bg-white shadow-lg rounded-xl hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-20 h-20 mb-4 bg-green-100 rounded-full">
                <School size={40} className="text-green-600" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">I'm a Teacher</h2>
              <p className="text-center text-gray-600">
                Manage your classes, create assignments, and track student progress
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}