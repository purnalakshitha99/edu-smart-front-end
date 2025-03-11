import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/roleselection'); // This navigates to the AuthPage
  };

  return (
    <div className="py-12 bg-blue-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm text-gray-600">By themadbrains in Inspiration</p>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Why Swift UI Should Be on the Radar of Every Mobile Developer
            </h1>
            <p className="mb-6 text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor lorem ipsum dolor sit amet de aliqua tempor.
            </p>
            <button 
              onClick={handleStartLearning} 
              className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Start learning now
            </button>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80" 
              alt="Developer working"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
