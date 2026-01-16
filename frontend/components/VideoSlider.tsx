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
              index === current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
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
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none">
                    
                    {/* This is your BIG RED PLAY BUTTON */}
                    <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.5)] group-hover:scale-125 transition-transform duration-500">
                        <PlayCircle className="text-white ml-1" size={48} />
                    </div>

                    {/* This is your BIG TITLE */}
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







// How the video slider was used in the home page before being removed becaause they had no channel for now but thi template will be used later
// import VideoSlider from '@/components/VideoSlider';
  
// const [highlights, setHighlights] = useState<any[]>([]);
// const [activeVideo, setActiveVideo] = useState<string | null>(null);



// // Fetch news and highlights from Supabase and set the states latestNews and highlights
//   useEffect(() => {
//     fetchMatches();
//     async function fetchContent() {
//       const { data: newsData } = await supabaseClient.from('news').select('*').eq('published', true).order('created_at', { ascending: false }).limit(3);
//       setLatestNews(newsData || []);
//       const { data: videoData } = await supabaseClient.from('highlights').select('*').eq('published', true).order('created_at', { ascending: false });
//       setHighlights(videoData || []);
//     }
//     fetchContent();
//   }, [fetchMatches]);


// {/* HIGHLIGHT SECTION ON THE HOME PAGE, the video slider */}
//       {!loading && highlights.length > 0 && (
//         <section className="py-20 bg-slate-950">
//           <div className="max-w-7xl mx-auto px-6 mb-12">
//             <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Match <span className="text-red-600">Highlights</span></h2>
//             <div className="h-2 w-20 bg-red-600 mt-4"></div>
//           </div>
//           {/* Uses the video slider component */}
//           <VideoSlider slides={highlights} onPlay={setActiveVideo} />
//         </section>
//       )}

//       {/* THE IFRAME FOR THE VIDEO BEING PLAYED */}
//       {activeVideo && (
//         <div className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4 md:p-12 backdrop-blur-md">
//           {/* Close Button */}
//           <button onClick={() => setActiveVideo(null)} className="absolute top-8 right-8 text-white/50 hover:text-red-600 transition-colors">
//             <X size={50} />
//           </button>

//           <div className="w-full max-w-5xl flex flex-col gap-4">
//             {/* The Video Player */}
//             <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
//               <iframe 
//                 width="100%" 
//                 height="100%" 
//                 src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`} 
//                 title="Video" 
//                 frameBorder="0" 
//                 allow="autoplay; encrypted-media; picture-in-picture"
//                 allowFullScreen
//               ></iframe>
//             </div>

//             <div className="text-center">
//               <p className="text-slate-500 text-[10px] uppercase tracking-widest italic">
//                 Video not loading? 
//                 <a 
//                   href={`https://www.youtube.com/watch?v=${activeVideo}`} 
//                   target="_blank" 
//                   className="ml-2 text-red-600 hover:text-red-400 font-black transition-colors underline underline-offset-4"
//                 >
//                   Watch directly on YouTube
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
//       )}