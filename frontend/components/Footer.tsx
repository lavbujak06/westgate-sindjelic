'use client';
import { useEffect, useState } from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { BsThreads } from 'react-icons/bs';

interface Sponsor {
  id: number;
  name: string;
  image_url: string;
  website_url: string;
}

export default function Footer() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/sponsors')
      .then(res => res.json())
      .then(data => setSponsors(Array.isArray(data) ? data : []))
      .catch(() => setSponsors([]));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white">
      {/* SPONSORS SECTION */}
      {sponsors.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100">
          <p className="text-center text-[15px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 italic">
            Partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10">
            {sponsors.map((s) => (
              <a 
                key={s.id} 
                href={s.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group transition-all duration-300 hover:scale-110"
              >
                <img 
                  src={s.image_url} 
                  alt={s.name} 
                  className="h-14 md:h-20 w-auto object-contain opacity-80 group-hover:opacity-100 transition-all" 
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* DARK SOCIAL BAR */}
      <div className="bg-[#020617] text-white pt-16 pb-8">
        {/* Full-width container to allow absolute positioning to the screen edges */}
        <div className="w-full px-6 relative flex flex-col items-center">
          
          {/* HEADER & SCROLL BUTTON ROW */}
          <div className="w-full flex items-center justify-center mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
              Official Social Media
            </h3>

            {/* SCROLL BUTTON - Pushed to the absolute right edge of the padding */}
            <button
              onClick={scrollToTop}
              className="absolute right-6 cursor-pointer after:content-['Back_To_Top'] after:text-[8px] after:font-black after:text-white after:absolute after:scale-0 hover:after:scale-100 after:duration-200 w-10 h-10 rounded-full border-2 border-slate-800 bg-black flex items-center justify-center duration-300 hover:rounded-[20px] hover:w-20 group/button overflow-hidden active:scale-90"
            >
              <svg
                className="w-3 fill-white delay-50 duration-200 group-hover/button:-translate-y-10"
                viewBox="0 0 384 512"
              >
                <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
              </svg>
            </button>
          </div>

          {/* Social Icons Container */}
          <div className="flex items-center gap-6 mb-12">
            <a href="https://facebook.com/westgatesindjelic" target="_blank" className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com/westgatesindjelic" target="_blank" className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all">
              <Instagram size={20} />
            </a>
            <a href="https://threads.net/@westgatesindjelic" target="_blank" className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all">
              <BsThreads size={20} />
            </a>
          </div>

          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Westgate Sindjelic <span className="text-red-600">FC</span>
            </h2>
          </div>

          {/* Copyright Row */}
          <div className="max-w-7xl mx-auto w-full pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">
              © 2026 Westgate Sindjelic Football Club
            </p>
            <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-slate-600">
              <a href="/pages/aboutUs" className="hover:text-white transition-colors">About Us</a>
              <a href="/pages/contact" className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}