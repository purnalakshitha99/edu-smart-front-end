import React from "react";
import examImage from "../../../assets/mainpage/exam.jpg";
import classImage from "../../../assets/mainpage/class.jpg";

const Section = () => {
  const blogPosts = [
    {
      imageSrc: examImage,
      title:
        "Class adds $30 million to its balance sheet for a Zoom-friendly edtech solution",
      description:
        "Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...",
      author: "Lina",
      views: "251,232",
    },
    {
      imageSrc: classImage,
      title:
        "Class adds $30 million to its balance sheet for a Zoom-friendly edtech solution",
      description:
        "Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...",
      author: "Lina",
      views: "251,232",
    },
  ];

  const RelatedBlogCard = ({ imageSrc, title, description, author, views }) => {
    return (
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <img src={imageSrc} alt={title} className="object-cover w-full h-48" />
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold">{title}</h3>
          <p className="mb-4 text-gray-600 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="https://via.placeholder.com/32"
                alt={author}
                className="w-8 h-8 mr-2 rounded-full"
              />
              <p className="text-sm font-semibold">{author}</p>
            </div>
            <div className="flex items-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.431-8.559a3.002 3.002 0 01-4.862.559 3.002 3.002 0 01-3.569-4.181 3 3 0 016.759-1.827 3.002 3.002 0 011.672 5.449z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs">{views}</span>
            </div>
          </div>
          <a
            href="#"
            className="block mt-2 text-sm text-blue-500 hover:underline"
          >
            Read more
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="py-12 bg-gray-100">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Related Blog</h2>
          <a href="#" className="text-sm text-blue-500 hover:underline">
            See all
          </a>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {blogPosts.map((post, index) => (
            <RelatedBlogCard key={index} {...post} />
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-l hover:bg-gray-300"></button>
          <button className="px-4 py-2 font-bold text-white bg-green-400 rounded-r hover:bg-green-500"></button>
        </div>
      </div>
    </div>
  );
};

export default Section;
