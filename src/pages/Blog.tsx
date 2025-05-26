import React from 'react';
import { Calendar, User, MessageSquare } from 'lucide-react';

const BlogPost = ({ title, excerpt, author, date, comments, image }: {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  comments: number;
  image: string;
}) => (
  <article className="bg-white rounded-lg shadow-md overflow-hidden">
    <img src={image} alt={title} className="w-full h-64 object-cover" />
    <div className="p-6">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <User className="h-4 w-4 mr-1" />
        <span className="mr-4">{author}</span>
        <Calendar className="h-4 w-4 mr-1" />
        <span className="mr-4">{date}</span>
        <MessageSquare className="h-4 w-4 mr-1" />
        <span>{comments} comments</span>
      </div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">{excerpt}</p>
      <a href="https://www.educations.com/articles-and-advice/5-reasons-online-learning-is-future-of-education-17146" className="text-blue-600 hover:text-blue-700 font-medium">
        Read More →
      </a>
    </div>
  </article>
);

const Blog = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Articles</h1>
          <p className="text-lg text-gray-600">Stay updated with our latest insights and news</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BlogPost
            title="The Future of Online Learning in 2024"
            excerpt="Discover how AI and virtual reality are transforming the landscape of online education and what it means for students and educators."
            author="John Smith"
            date="March 15, 2024"
            comments={24}
            image="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          />
          <BlogPost
            title="10 Tips for Successful Remote Learning"
            excerpt="Learn the best practices and strategies to make the most of your online learning experience and achieve your educational goals."
            author="Sarah Johnson"
            date="March 12, 2024"
            comments={18}
            image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          />
        </div>
      </div>
    </div>
  );
};

export default Blog;