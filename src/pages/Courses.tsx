import React from 'react';
import { BookOpen, Clock, Star, Users } from 'lucide-react';

const CourseCard = ({ title, instructor, rating, duration, students, image }: {
  title: string;
  instructor: string;
  rating: number;
  duration: string;
  students: number;
  image: string;
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">By {instructor}</p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="h-5 w-5 text-yellow-400 mr-1" />
          <span>{rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-500 mr-1" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-5 w-5 text-gray-500 mr-1" />
          <span>{students}</span>
        </div>
      </div>
      <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
        Enroll Now
      </button>
    </div>
  </div>
);

const Courses = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Featured Courses</h1>
          <p className="text-lg text-gray-600">Expand your knowledge with our expert-led courses</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CourseCard
            title="Complete React Developer Course"
            instructor="John Smith"
            rating={4.8}
            duration="20h"
            students={1234}
            image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          />
          <CourseCard
            title="Python for Data Science"
            instructor="Sarah Johnson"
            rating={4.9}
            duration="25h"
            students={2156}
            image="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          />
          <CourseCard
            title="UI/UX Design Fundamentals"
            instructor="Mike Wilson"
            rating={4.7}
            duration="15h"
            students={1876}
            image="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          />
        </div>
      </div>
    </div>
  );
};

export default Courses;