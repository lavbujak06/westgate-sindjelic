'use client';

import React, { useState } from 'react';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import { PlayCircle } from 'lucide-react';

interface VideoSlide {
  id: string;
  title: string;
  youtube_id: string;
}

export default function VideoSlider({ slides, onPlay }: { slides: VideoSlide[], onPlay: (id: string) => void }) {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);

  if (!Array.isArray(slides) || slides.length <= 0) return null;

  return (
    <div className="relative w-[95%] max-w-[1400px] mx-auto h-[500px] md:h-[650px] overflow-hidden group rounded-[40px] shadow-2xl border-4 border-white/5">
      
      {/* Navigation Arrows */}
      <FaArrowCircleLeft
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-red-600 cursor-pointer z-30 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
        size={45}
      />
      
      {slides.map((slide, index) => {
        const thumbUrl = `https://img.youtube.com/vi/${slide.youtube_id}/maxresdefault.jpg`;
        
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            {index === current && (
              <div className="relative w-full h-full bg-black cursor-pointer" onClick={() => onPlay(slide.youtube_id)}>
                {/* BLURRED BACKGROUND */}
                <img
                  src={thumbUrl}
                  alt="Blur Background"
                  className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-50 scale-110"
                />
                
                {/* MAIN THUMBNAIL */}
                <img
                  src={thumbUrl}
                  alt={slide.title}
                  className="relative w-full h-full object-contain z-10 p-4 md:p-12"
                />

                {/* PLAY OVERLAY */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.5)] group-hover:scale-125 transition-transform duration-500">
                        <PlayCircle className="text-white ml-1" size={48} />
                    </div>
                    <h3 className="mt-8 text-white font-black uppercase italic tracking-tighter text-3xl md:text-5xl drop-shadow-2xl">
                        {slide.title}
                    </h3>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <FaArrowCircleRight
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-red-600 cursor-pointer z-30 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
        size={45}
      />

      {/* Slide Counter */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
        <p className="text-white font-black italic text-xs tracking-[0.3em]">
          BROADCAST {current + 1} <span className="text-red-600">/</span> {length}
        </p>
      </div>
    </div>
  );
}