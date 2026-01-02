// components/Hero.tsx
import React from 'react';

interface HeroProps {
  heading: string;
  message: string;
  showButton?: boolean; // Optional button
}

const Hero = ({ heading, message, showButton = false }: HeroProps) => {
  return (
    <div className='relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center custom-img'>
      <div className='absolute inset-0 bg-black/60 z-10' />
      <div className='relative z-20 text-center px-4'>
        <h1 className='text-4xl md:text-7xl font-black text-white uppercase tracking-tighter'>
          {heading}
        </h1>
        <div className='h-1 w-20 bg-red-600 mx-auto my-4' />
        <p className='text-lg md:text-xl text-gray-200 font-light'>{message}</p>
        
        {showButton && (
          <button className='mt-8 px-8 py-3 border-2 border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-all'>
            Explore Teams
          </button>
        )}
      </div>
    </div>
  );
};
export default Hero;