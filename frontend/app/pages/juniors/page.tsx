'use client';
import React from "react";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CoachStaff from "@/components/CoachStuff";
import Link from 'next/link';
import Image from 'next/image';
import MatchSlider from '@/components/MatchSlider';
import { MediaItem } from "@/app/types";


export default function JuniorsPage() {
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    // Fetch Gallery
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media/juniors`)
      .then(res => res.json())
      .then(data => {
        setGallery(Array.isArray(data) ? data : []);
        setLoading(false); 
      })
      .catch((err) => {
        console.error("Gallery Fetch Error:", err);
        setLoading(false); 
      });
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <Hero 
        heading="Junior Academy" 
        message="Developing the next generation of Westgate talent." 
        showButton={false} 
      />

      {/* 2. CLUB PHILOSOPHY SECTION */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-30">
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 border-b-4 border-red-600">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 mb-6">
                Our <span className="text-red-600">Philosophy</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At Westgate Sindjelic, our junior program is built on the foundation of 
                <strong> discipline, respect, and technical excellence.</strong> We don't just 
                train players; we build character.
              </p>
              <ul className="space-y-3">
                {['Technical Mastery', 'Tactical Intelligence', 'Physical Literacy', 'Social Growth'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-gray-700">
                    <span className="w-2 h-2 bg-red-600 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Image
                src="/westgateLogo.jpeg"
                alt="Academy Action"
                width={600}
                height={600}
                className="object-contain w-full max-w-[420px] h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. AGE GROUPS GRID */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black uppercase italic text-gray-900">Available <span className="text-red-700">Age Groups</span></h2>
          <p className="text-gray-500 font-medium mt-2">Registration open for the 2026 season</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['U7 - U9', 'U10 - U12', 'U13 - U15', 'U16 - U18'].map((age) => (
            <div key={age} className="bg-black text-white p-8 rounded-2xl text-center border-t-4 border-red-600 hover:scale-105 transition-transform cursor-default">
              <h3 className="text-2xl font-black mb-1">{age}</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Competitive</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FULL WIDTH GALLERY SECTION (Moved outside of max-w-7xl) */}
      {gallery.length > 0 && !loading && (
        <section className="w-full mb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
            <h2 className="text-black font-black uppercase tracking-tighter text-4xl italic">
              Team <span className="text-red-600">Gallery</span>
            </h2>
          </div>
          
          <div className="w-full">
            <MatchSlider slides={gallery} />
          </div>
        </section>
      )}

      {/* 4. THE COACHES (The Dynamic Section we built) */}
      <div className="bg-white border-y border-gray-200">
        <CoachStaff teamSlug="juniors" />
      </div>

      {/* 5. CALL TO ACTION */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-700 rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            {/* Background design element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            
            <h2 className="text-3xl md:text-5xl font-black uppercase italic leading-none mb-6">
              Become part of <br /> the <span className="text-black">Legacy</span>
            </h2>
            <p className="text-red-100 mb-10 max-w-md mx-auto">
              Ready to take your game to the next level? Join Westgate Sindjelic today and train with the best.
            </p>
            <Link 
              href="/pages/contact" 
              className="inline-block bg-white text-red-700 px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all shadow-xl"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}