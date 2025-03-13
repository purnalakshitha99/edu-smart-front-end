import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const BlogCard = ({ title, image, views, navigateTo }: { title: string; image: string; views: string, navigateTo: 'class'|'exams' }) => {
 const navigate = useNavigate();
  return(<div  className="overflow-hidden bg-white rounded-lg shadow-md" onClick={()=>navigate(navigateTo)}>
    <img src={image} alt={title} className="object-cover w-full h-48" />
    <div className="p-4">
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">Like</span>
        </div>
        <div className="text-sm text-gray-600">{views} views</div>
      </div>
    </div>
  </div>)
};

const RelatedBlogs = () => {
  return (
    <div className="py-12 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Related Blog</h2>
          <a href="#" className="text-blue-600 hover:text-blue-700">See all</a>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <BlogCard 
            title="Exam"
            image="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
            views="15,232"
            navigateTo='exams'
          />
          <BlogCard 
            title="Classroom"
            image="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            views="20,232"
            navigateTo='class'
          />
        </div>
      </div>
    </div>
  );
}

export default RelatedBlogs;