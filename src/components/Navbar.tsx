import React, { useState, useEffect, useRef } from "react";
import { Search, User, Power, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const storedProfileImage = localStorage.getItem("imageurl");
      if (storedProfileImage) {
        setProfileImage(storedProfileImage);
      }
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("imageurl");
    navigate("/login");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              EDUSMART
            </Link>
          </div>

          <div className="items-center hidden space-x-8 md:flex">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/courses" className="text-gray-700 hover:text-gray-900">
              Courses
            </Link>
            <Link to="/exams" className="text-gray-700 hover:text-gray-900">
              Exams
            </Link>
            <Link to="/company" className="text-gray-700 hover:text-gray-900">
              Company
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-gray-900">
              Blog
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900">
              About Us
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-500" />

            <div className="relative" ref={dropdownRef}>
              {profileImage ? (
                <button onClick={toggleDropdown}>
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-10 h-10 border-2 border-gray-300 rounded-full cursor-pointer"
                  />
                </button>
              ) : (
                <User
                  className="w-5 h-5 text-gray-500 cursor-pointer"
                  onClick={toggleDropdown}
                />
              )}

              {isDropdownOpen && (
                <div className="absolute right-0 z-10 w-48 mt-2 bg-white rounded-md shadow-xl">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
