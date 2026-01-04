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
    <div className="mb-16 bg-white p-4 rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <h2 className="text-xl font-black uppercase italic tracking-tighter mb-4 px-4">
        Match <span className="text-red-600">Gallery</span>
        </h2>
        {/* Reduced height to 400px-500px to maintain sharpness */}
        <div className="relative flex justify-center items-center h-[350px] md:h-[450px] rounded-3xl overflow-hidden bg-slate-950">
        <FaArrowCircleLeft
            onClick={prevSlide}
            className="absolute left-6 text-white/70 hover:text-white cursor-pointer z-10 transition-all hover:scale-110"
            size={35}
        />
        
        {slides.map((slide, index) => (
            <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === current ? 'opacity-100' : 'opacity-0'
            }`}
            >
            {index === current && (
                <img
                src={slide.url}
                alt="Match Action"
                /* object-contain ensures no cropping, bg-slate-950 fills the gaps */
                className="w-full h-full object-contain mx-auto"
                loading="eager" 
                />
            )}
            </div>
        ))}

        <FaArrowCircleRight
            onClick={nextSlide}
            className="absolute right-6 text-white/70 hover:text-white cursor-pointer z-10 transition-all hover:scale-110"
            size={35}
        />
        </div>
    </div>
    );
}