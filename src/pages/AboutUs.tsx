import React from 'react';
import { BookOpen, Users, Globe, Award } from 'lucide-react';

const TeamMember = ({ name, role, image }: { name: string; role: string; image: string }) => (
  <div className="text-center">
    <img
      src={image}
      alt={name}
      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
    />
    <h3 className="text-xl font-semibold mb-1">{name}</h3>
    <p className="text-gray-600">{role}</p>
  </div>
);

const AboutUs = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About TORC</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're passionate about transforming education through technology and making quality learning accessible to everyone around the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              At TORC, we believe that education is a fundamental right. Our mission is to break down the barriers to education
              and provide high-quality learning experiences that are accessible, engaging, and effective.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                <span>Quality Content</span>
              </div>
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                <span>Expert Instructors</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-6 w-6 text-blue-600 mr-2" />
                <span>Global Access</span>
              </div>
              <div className="flex items-center">
                <Award className="h-6 w-6 text-blue-600 mr-2" />
                <span>Certified Learning</span>
              </div>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Team collaboration"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TeamMember
              name="John Smith"
              role="CEO & Founder"
              image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            />
            <TeamMember
              name="Sarah Johnson"
              role="Head of Education"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            />
            <TeamMember
              name="Michael Chen"
              role="CTO"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            />
            <TeamMember
              name="Emily Davis"
              role="Head of Design"
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;