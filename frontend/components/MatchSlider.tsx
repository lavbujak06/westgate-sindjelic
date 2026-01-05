'use client';

import React, { useState } from 'react';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';

interface Slide {
  id: string;
  url: string;
}

export default function MatchSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);

  if (!Array.isArray(slides) || slides.length <= 0) return null;

  return (
    /* max-w-[95%] shortens the width slightly so it's not touching the screen edges */
    <div className="relative w-[95%] max-w-[1400px] mx-auto h-[500px] md:h-[650px] overflow-hidden group rounded-3xl">
      
      {/* Left Arrow */}
      <FaArrowCircleLeft
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer z-30 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
        size={40}
      />
      
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {index === current && (
            <div className="relative w-full h-full bg-black">
              {/* BLURRED BACKGROUND: Fills the gaps if the photo is too narrow */}
              <img
                src={slide.url}
                alt="Blur Background"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110"
              />
              
              {/* MAIN IMAGE: object-contain keeps the original size/aspect ratio */}
              <img
                src={slide.url}
                alt="Match Action"
                className="relative w-full h-full object-contain z-10"
                loading="eager" 
              />
            </div>
          )}
        </div>
      ))}

      {/* Right Arrow */}
      <FaArrowCircleRight
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer z-30 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
        size={40}
      />

      {/* Slide Counter Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 bg-black/30 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
        <p className="text-white font-black italic text-[10px] tracking-[0.2em]">
          {current + 1} <span className="text-red-600">/</span> {length}
        </p>
      </div>
    </div>
  );
}