import React from "react";

const Section = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-blue-100 text-blue-500 rounded-full w-8 h-8 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 9a1 1 0 012 0V9a1 1 0 112 0v2a1 1 0 11-2 0V9a3 3 0 10-6 0v2a1 1 0 012 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Class adds $30 million to its balance sheet for a Zoom-friendly
              edtech solution
            </h3>
            <p className="text-gray-600 mb-4">
              Class, launched less than a year ago by Blackboard co-founder
              Michael Chasen, integrates exclusively...
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">Lina</p>
                <a href="#" className="text-blue-500 hover:underline">
                  Read more
                </a>
              </div>
              <p className="text-sm">251,232</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-green-100 text-green-500 rounded-full w-8 h-8 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 9a1 1 0 012 0V9a1 1 0 112 0v2a1 1 0 11-2 0V9a3 3 0 10-6 0v2a1 1 0 012 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Class adds $30 million to its balance sheet for a Zoom-friendly
              edtech solution
            </h3>
            <p className="text-gray-600 mb-4">
              Class, launched less than a year ago by Blackboard co-founder
              Michael Chasen, integrates exclusively...
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">Lina</p>
                <a href="#" className="text-blue-500 hover:underline">
                  Read more
                </a>
              </div>
              <p className="text-sm">251,232</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section;
