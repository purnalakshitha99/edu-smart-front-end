import React from 'react';
import { Award, Users, Globe, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value }: { icon: any; title: string; value: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <Icon className="h-8 w-8 text-blue-600 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{value}</h3>
    <p className="text-gray-600">{title}</p>
  </div>
);

const Company = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Company</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're on a mission to transform education through technology and make quality learning accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard icon={Users} title="Active Students" value="50,000+" />
          <StatCard icon={Globe} title="Countries" value="150+" />
          <StatCard icon={Award} title="Course Completion Rate" value="94%" />
          <StatCard icon={TrendingUp} title="Year Over Year Growth" value="200%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Team meeting"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-6">
              Founded in 2020, EDUSmart has grown from a small startup to a leading online education platform. 
              We believe that education should be accessible to everyone, regardless of their location or background.
            </p>
            <p className="text-gray-600 mb-6">
              Our team of dedicated professionals works tirelessly to create high-quality educational content 
              and provide the best learning experience for our students.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Join Our Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;