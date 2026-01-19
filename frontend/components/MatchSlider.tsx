'use client';

import React, { useState, useEffect } from 'react';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';

interface Slide {
  id: string;
  url: string;
}

export default function MatchSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const length = slides.length;

  useEffect(() => {
    setIsLoaded(false);
  }, [current]);

  const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);

  if (!Array.isArray(slides) || slides.length <= 0) return null;

  return (
    <div className="relative w-[95%] max-w-[1400px] mx-auto h-[500px] md:h-[650px] overflow-hidden group rounded-3xl bg-neutral-900">
      
      {/* 1. SHARED LOADING SKELETON */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-900">
          <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Navigation Arrows */}
      <FaArrowCircleLeft
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer z-40 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
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
            <div className="relative w-full h-full">
              {/* 2. BLURRED BACKDROP */}
              <img
                src={slide.url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-40 scale-110"
              />
              
              {/* 3. MAIN IMAGE */}
              <img
                src={slide.url}
                alt="Match Action"
                onLoad={() => setIsLoaded(true)}
                className={`relative w-full h-full object-contain z-10 transition-opacity duration-500 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                } [image-rendering:-webkit-optimize-contrast] [image-rendering:crisp-edges]`}
                loading="eager" 
              />

              {/* 4. TEXTURE & VIGNETTE OVERLAY */}
              <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/60 opacity-80" />
            </div>
          )}
        </div>
      ))}

      <FaArrowCircleRight
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer z-40 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
        size={40}
      />

      {/* Slide Counter Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 bg-black/40 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10">
        <p className="text-white font-black italic text-[10px] tracking-[0.2em]">
          {current + 1} <span className="text-red-600">/</span> {length}
        </p>
      </div>
    </div>
  );
}