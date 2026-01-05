'use client';
import { useEffect, useState } from 'react';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

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

  return (
    <footer className="w-full bg-white">
      {/* SPONSORS SECTION - Logos are now large and clear */}
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
                  // h-20 makes them very recognizable
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* DARK SOCIAL BAR */}
      <div className="bg-[#020617] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 italic">
            Official Social Media
          </h3>

          <div className="flex items-center gap-6 mb-12">
            <a href="https://facebook.com/westgatesindjelic" target="_blank" className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com/westgatesindjelic" target="_blank" className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all">
              <Instagram size={20} />
            </a>
            <a href="https://threads.net/@westgatesindjelic" target="_blank" className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all">
              <MessageCircle size={20} />
            </a>
          </div>

          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Westgate Sindjelic <span className="text-red-600">FC</span>
            </h2>
          </div>

          <div className="w-full pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
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