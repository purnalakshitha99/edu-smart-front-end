import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const Newsletter = () => {
  const navigate = useNavigate();  // Initialize useNavigate

  const handleSubscribeClick = () => {
    navigate('/teacherhomepage'); // Replace with your actual route to TeachersHomePage
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Subscribe to get our Newsletter</h2>
        <div className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your Email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={handleSubscribeClick} // Add onClick handler
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Newsletter;