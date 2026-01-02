import Link from 'next/link';
import React from 'react';

const Hero = ({ heading, message }: { heading: string; message: string }) => {
  return (
    <div className='relative h-screen w-full flex items-center justify-center custom-img'>
      {/* 1. DARK OVERLAY (This gives the "End Result" look) */}
      <div className='absolute inset-0 bg-black/60 z-10' />

      {/* 2. CONTENT CONTAINER (Must be higher z-index than overlay) */}
      <div className='relative z-20 text-center px-4'>
        <h1 className='text-5xl md:text-8xl font-black text-white uppercase tracking-tighter'>
          {heading}
        </h1>
        <div className='h-1 w-24 bg-red-600 mx-auto my-6' /> {/* Stylish accent line */}
        <p className='text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto'>
          {message}
        </p>
        <button className='mt-10 px-10 py-4 bg-transparent border-2 border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-all duration-300'>
          <Link href="/pages/aboutUs">About Us</Link>
        </button>
      </div>
    </div>
  );
};

export default Hero;