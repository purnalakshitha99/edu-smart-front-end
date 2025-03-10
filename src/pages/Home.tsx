import React from 'react';
import Hero from '../components/Hero';
import RelatedBlogs from '../components/RelatedBlogs';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <>
      <Hero />
      <RelatedBlogs />
      <Newsletter />
    </>
  );
};

export default Home;