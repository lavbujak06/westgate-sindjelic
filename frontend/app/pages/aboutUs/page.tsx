// app/pages/about/page.tsx
'use client';

import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import { Shield, Users, Trophy, Heart } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="bg-white">
      <Navbar />
      
      {/* Dynamic Hero Section */}
      <Hero 
        heading="Our Heritage" 
        message="Established 1985 in the heart of Ardeer" 
        showButton={false} 
      />
      
      {/* Identity Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block bg-red-600 text-white px-4 py-1 skew-x-[-12deg] font-black uppercase text-sm">
              Our Story
            </div>
            <h2 className="text-5xl md:text-6xl font-black uppercase leading-tight tracking-tighter">
              Westgate <span className="text-red-600">Sindjelic</span> FC
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed italic border-l-4 border-blue-800 pl-6">
              "Founded by the Serbian community, built for the future of Melbourne football."
            </p>
            <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
              <p>
                Since 1985, Westgate Sindjelic has stood as a beacon of culture and athletic excellence in Ardeer. What began as a social gathering for Serbian immigrants has evolved into one of the most respected family-oriented football clubs in the region.
              </p>
              <p>
                We operate on the pillars of **Faith, Family, and Football**. Every time a player pulls on the red, white, and blue kit, they aren't just representing a team—they are carrying forward a legacy of resilience and community pride that spans nearly four decades.
              </p>
            </div>
          </div>

          {/* Visual Grid */}
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="absolute -inset-4 bg-gray-100 -z-10 rounded-2xl rotate-3"></div>
            <div className="h-80 relative rounded-xl shadow-2xl border-4 border-white overflow-hidden bg-gray-200">
              <Image 
                src="/serbiaFlag.png" 
                alt="Westgate Sindjelic Heritage"
                fill
                priority
                className="object-cover" 
              />
            </div>
            <div className="space-y-4">
              <div className="h-40 bg-red-600 rounded-xl shadow-lg flex flex-col items-center justify-center p-6 text-white font-black text-center italic uppercase transform hover:scale-105 transition-transform">
                <span className="text-2xl tracking-tighter">1985</span>
                <span className="text-xs opacity-80">Foundation Year</span>
              </div>
              <div className="h-36 bg-blue-800 rounded-xl shadow-lg flex items-center justify-center p-4 text-white font-bold text-center italic text-sm">
                "Fudbal je više od igre."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars - Icon Grid */}
      <section className="bg-gray-50 py-24 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-black uppercase tracking-widest italic">The Sindjelic Standard</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Discipline", text: "On and off the pitch, we hold our players to the highest standards of conduct." },
              { icon: Users, title: "Community", text: "A home for the Serbian diaspora and a welcoming environment for all cultures." },
              { icon: Heart, title: "Family", text: "Multiple generations of families have called Westgate Sindjelic their home." },
              { icon: Trophy, title: "Ambition", text: "From juniors to seniors, we strive for tactical excellence and results." },
            ].map((pillar, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-red-600 transition-colors group">
                <pillar.icon className="w-12 h-12 text-blue-800 mb-6 group-hover:text-red-600 transition-colors" />
                <h4 className="text-xl font-bold uppercase mb-3">{pillar.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ardeer Statement */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-6xl md:text-8xl font-black text-gray-100 uppercase absolute left-0 right-0 -z-10 select-none">
                ARDEER PRIDE
            </h2>
            <div className="relative z-10">
                <p className="text-2xl md:text-3xl font-bold text-blue-900 uppercase italic tracking-tighter mb-8">
                    Rooted in Ardeer. <br/>
                    <span className="text-red-600">Respected across Victoria.</span>
                </p>
                <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
                <p className="max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed">
                    Our clubrooms at Ardeer are more than a sports facility—they are a cultural hub. Whether it's the 
                    after-match celebrations or the weekend junior drills, the heartbeat of Westgate Sindjelic 
                    is the people of Melbourne's western suburbs.
                </p>
            </div>
        </div>
      </section>
      
    </main>
  );
}