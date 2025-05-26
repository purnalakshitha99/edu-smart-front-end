import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Trophy,
  FileText,
  User,
  Mail,
  MapPin,
  GraduationCap,
  UserCircle,
} from "lucide-react";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  profile_picture?: string | null;
  address: string;
  gender: string;
  student_id: string;
}

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userid");

    if (!token || !userId) {
      console.warn("No token or user ID found, redirecting to login");
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/auth/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("student details", response);

        if (response.status === 200) {
          setUserProfile(response.data);
        } else {
          console.error("Failed to fetch user profile:", response.data.message);
          setError(`Failed to fetch profile: ${response.data.message}`);
        }
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
        setError(`Error fetching profile: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleViewResults = () => {
    navigate("/answer-report");
  };

  const handleViewEthicalReport = () => {
    navigate("/ethicalReport");
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto mt-8 p-6 bg-white shadow-md rounded-md min-h-screen">
          <div>Loading profile...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto mt-8 p-6 bg-white shadow-md rounded-md min-h-screen">
          <div className="text-red-500">Error: {error}</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-8 p-6 bg-white shadow-md rounded-md min-h-screen">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Student Profile</h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {userProfile?.profile_picture && (
              <img
                src={userProfile.profile_picture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-4 mx-auto border-4 border-blue-100"
              />
            )}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">Username</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {userProfile?.username}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">Email</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {userProfile?.email}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">Student ID</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {userProfile?.student_id}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">Gender</span>
                </div>
                <span className="font-semibold text-gray-800 capitalize">
                  {userProfile?.gender === "male"
                    ? "Male"
                    : userProfile?.gender === "female"
                    ? "Female"
                    : userProfile?.gender}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">Address</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {userProfile?.address}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">Role</span>
                </div>
                <span className="font-semibold text-gray-800 capitalize">
                  {userProfile?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleViewResults}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              View Exam Results
            </button>

            <button
              onClick={handleViewEthicalReport}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Ethical Report
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
