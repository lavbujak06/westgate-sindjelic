'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import VideoSlider from '@/components/VideoSlider';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, X } from 'lucide-react';

export default function HomePage() {
  const [nextMatch, setNextMatch] = useState<any>(null);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // 1. Fetch NEXT Match for Senior Men
        const { data: allMatches } = await supabaseClient
          .from('matches')
          .select('*')
          .eq('team_name', 'Senior Men');

        if (allMatches && allMatches.length > 0) {
          const now = new Date();
          const parseMatchDate = (dateStr: string) => {
            const datePart = dateStr.split(' ')[0]; 
            const [day, month, year] = datePart.split('/').map(Number);
            return new Date(2000 + year, month - 1, day);
          };

          const futureMatches = allMatches
            .filter(m => parseMatchDate(m.date_text) >= now)
            .sort((a, b) => parseMatchDate(a.date_text).getTime() - parseMatchDate(b.date_text).getTime());

          setNextMatch(futureMatches.length > 0 ? futureMatches[0] : 'OFF_SEASON');
        } else {
          setNextMatch('OFF_SEASON');
        }

        // 2. Fetch Latest News (3 items)
        const { data: newsData } = await supabaseClient
          .from('news')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3);
        setLatestNews(newsData || []);

        // 3. Fetch Highlights for the Slider
        const { data: videoData } = await supabaseClient
          .from('highlights')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });
        setHighlights(videoData || []);

      } catch (err) {
        console.error("Home Page Fetch Error:", err);
        setNextMatch('OFF_SEASON');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleVenueClick = (venue: string) => {
    const confirmLeave = window.confirm(`You are leaving Westgate Sindjelic to view the location of ${venue} on Google Maps. Continue?`);
    if (confirmLeave) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`, '_blank');
    }
  };

  return (
    <main className="bg-[#fcfcfc] italic overflow-x-hidden">
      <Navbar />
      <Hero heading='Westgate Sindjelic' message='Faith. Family. Football.' />

      {/* 1. DYNAMIC MATCH CENTER */}
      <section className="bg-[#020617] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          {!loading && (
            nextMatch && nextMatch !== 'OFF_SEASON' ? (
              <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-slate-900 to-red-950 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="flex items-center gap-8 mb-6 md:mb-0">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Home</p>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Westgate</h3>
                  </div>
                  <span className="text-4xl font-black text-slate-700">VS</span>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Away</p>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">{nextMatch.opponent}</h3>
                  </div>
                </div>
                
                <div className="flex flex-col items-center md:items-end gap-3">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-tighter">
                    <Calendar size={16} className="text-red-600" />
                    {nextMatch.date_text} | {nextMatch.time_text}
                  </div>
                  <button 
                    onClick={() => handleVenueClick(nextMatch.venue)}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors group"
                  >
                    <MapPin size={16} className="text-red-600 group-hover:animate-bounce" />
                    {nextMatch.venue}
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center">
                <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none">
                  <h1 className="text-9xl font-black italic uppercase">Westgate</h1>
                </div>
                <div className="relative z-10">
                  <span className="bg-red-600 text-white text-[10px] font-black uppercase px-4 py-1 tracking-[0.3em] mb-4 inline-block">
                    Status: Off-Season
                  </span>
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
                    The hard work <span className="text-red-600">never stops.</span>
                  </h3>
                  <p className="text-slate-400 max-w-xl mx-auto mb-8 font-medium italic not-italic">
                    Preparing for the 2026 Season. Keep an eye on our latest news for trial dates and announcements.
                  </p>
                  <Link href="/pages/news">
                    <button className="border border-slate-700 hover:bg-white hover:text-black transition-all px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest">
                      Follow the preparation
                    </button>
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* 2. DYNAMIC NEWS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none italic">Latest News</h2>
            <div className="h-2 w-20 bg-red-600 mt-4"></div>
          </div>
          <Link href="/pages/news" className="group flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-red-600 transition-colors">
            View All News <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.length > 0 && (
            <>
              <Link href={`/pages/news/${latestNews[0].id}`} className="md:col-span-2 relative h-[500px] rounded-3xl overflow-hidden group cursor-pointer shadow-xl">
                <img src={latestNews[0].image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-10">
                  <h3 className="text-4xl font-black text-white uppercase leading-none mb-4 italic tracking-tighter">{latestNews[0].title}</h3>
                  <p className="text-slate-300 font-medium line-clamp-2 italic not-italic">{latestNews[0].content}</p>
                </div>
              </Link>
              <div className="flex flex-col gap-6">
                {latestNews.slice(1, 3).map((news) => (
                  <Link key={news.id} href={`/pages/news/${news.id}`} className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                    <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                      <img src={news.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900 line-clamp-2 italic">{news.title}</h4>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 3. ABOUT US SECTION */}
      <section className="bg-white py-20 border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="md:w-1/2 order-2 md:order-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 mb-4">Our Legacy</h2>
            <h3 className="text-6xl font-black uppercase tracking-tighter text-slate-900 mb-6 leading-[0.85] italic">Faith.<br/>Family.<br/>Sindjelic.</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-8 italic not-italic">
              Founded on the principles of community and competition, Westgate Sindjelic is more than a football club. We are a home for those who value heritage and the beautiful game.
            </p>
            <Link href="/pages/aboutUs">
              <button className="bg-slate-900 text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-red-600 transition-colors">
                Learn Our Story
              </button>
            </Link>
          </div>
          <div className="md:w-1/2 order-1 md:order-2 w-full">
            <div className="relative h-[400px] md:h-[550px] w-full">
              <img 
                src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000"
                className="w-full h-full object-cover rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" 
                alt="Club Heritage"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC HIGHLIGHTS SLIDER */}
      {!loading && highlights.length > 0 && (
        <section className="py-24 bg-slate-950">
          <div className="max-w-7xl mx-auto px-6 mb-12 text-center md:text-left">
            <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white leading-none">
              Match <span className="text-red-600">Highlights</span>
            </h2>
            <div className="h-2 w-24 bg-red-600 mt-6 mx-auto md:mx-0"></div>
          </div>

          <VideoSlider slides={highlights} onPlay={setActiveVideo} />
        </section>
      )}

      {/* VIDEO MODAL PLAYER */}
      {activeVideo && (
        <div className="fixed inset-0 z-[1000] bg-black/98 flex items-center justify-center p-4 md:p-12 backdrop-blur-md">
          <button 
            onClick={() => setActiveVideo(null)}
            className="absolute top-8 right-8 text-white/50 hover:text-red-600 transition-colors focus:outline-none"
          >
            <X size={50} strokeWidth={3} />
          </button>

          <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.3)] border border-white/10 bg-black">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&modestbranding=1&rel=0`}
              title="YouTube Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}