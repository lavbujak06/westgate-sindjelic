'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Match, News, MatchState } from './types';

export default function HomePage() {
  // State variables
  const [nextMatch, setNextMatch] = useState<MatchState>(null);
  const [timeLeft, setTimeLeft] = useState({ 
    days: 0, hours: 0, minutes: 0, seconds: 0, status: 'UPCOMING' 
  });
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);


  // FUNCTNIONS START HERE
  // Function to parse match date and time into a Date object
  const getMatchDateObject = useCallback((dateStr: string, timeStr: string) => {
    if (!dateStr) return new Date(0);
    const datePart = dateStr.split(' ')[0];
    const [day, month, yearPart] = datePart.split('/').map(Number);
    const year = yearPart < 100 ? 2000 + yearPart : yearPart;

    let hours = 12, minutes = 0;
    if (timeStr && timeStr.includes(':')) {
      const timeParts = timeStr.split(':');
      hours = parseInt(timeParts[0], 10);
      minutes = parseInt(timeParts[1], 10);
    }
    return new Date(year, month - 1, day, hours, minutes, 0);
  }, []);


  // Function to fetch matches from Supabase and sets the next match being either a match or 'OFF-SEASON'
  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabaseClient
        .from('games_cache')
        .select('*')
        .eq('team_name', 'Senior Men');

        const allMatches = data as Match[];

      if (allMatches && allMatches.length > 0) {
        const now = new Date();
        const validMatches = allMatches
          .filter(m => {
            const mDate = getMatchDateObject(m.date_text, m.time_text);
            const expiryTime = mDate.getTime() + (2 * 60 * 60 * 1000);
            return now.getTime() < expiryTime;
          })
          .sort((a, b) => getMatchDateObject(a.date_text, a.time_text).getTime() - getMatchDateObject(b.date_text, b.time_text).getTime());

        setNextMatch(validMatches.length > 0 ? validMatches[0] : 'OFF_SEASON');
      } else {
        setNextMatch('OFF_SEASON');
      }
    } catch (err) {
      setNextMatch('OFF_SEASON');
    } finally {
      setLoading(false);
    }
  }, [getMatchDateObject]);
  
  // fetch news function
  const fetchNews = useCallback(async () => {
    const { data, error } = await supabaseClient
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (!error && data) {
      setLatestNews(data);
    }
  }, []);

  // add the useEffect to make sure both news and latest match function are called
  useEffect(() => {
    fetchMatches();
    fetchNews();
  }, [fetchMatches, fetchNews]);

  // useEffect Countdown timer, sets the time left and sets it to either live or finished depending on the time
  useEffect(() => {
    if (!nextMatch || nextMatch === 'OFF_SEASON') return;
    const target = getMatchDateObject(nextMatch.date_text, nextMatch.time_text);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;
      const timeSinceKickoff = now - target.getTime();
      const twoHoursInMs = 2 * 60 * 60 * 1000;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          status: 'UPCOMING'
        });
      } else if (timeSinceKickoff < twoHoursInMs) {
        setTimeLeft(prev => ({ ...prev, status: 'LIVE' }));
      } else {
        setTimeLeft(prev => ({ ...prev, status: 'FINISHED' }));
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextMatch, getMatchDateObject]);

  // Updates the latest match after a match has finished
  useEffect(() => {
    if (timeLeft.status === 'FINISHED') fetchMatches();
  }, [timeLeft.status, fetchMatches]);

  // Dynamic Home/Away logic
  const isMatchObject = nextMatch && typeof nextMatch !== 'string';

  const isHome = isMatchObject? nextMatch.venue === "Ardeer Reserve" : false;
  const homeTeam = isMatchObject ? (isHome ? 'Westgate' : nextMatch.opponent) : "";
  const awayTeam = isMatchObject ? (isHome ? nextMatch.opponent : 'Westgate') : "";

  return (
    <main className="bg-[#fcfcfc] italic overflow-x-hidden">
      <Navbar />
      <Hero heading='Westgate Sindjelic' message='Faith. Family. Football.' />

      {/* NEXT MATCH SECTION */}
      <section className="bg-[#020617] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">

          {/* {this is for the header} */}
          {!loading && nextMatch && nextMatch !== 'OFF_SEASON' && (
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-2 bg-red-600 rounded-full"></div>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                Next Match <br /> Senior Men
              </h2>
            </div>
          )}

          {!loading && nextMatch && nextMatch !== 'OFF_SEASON' ? (
            
            <div className="relative group max-w-5xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-slate-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              
              
              <div className="relative bg-slate-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="grid lg:grid-cols-12">
                  
                  {/* LEFT: MATCH DETAILS */}
                  <div className="lg:col-span-8 p-6 md:p-10 bg-gradient-to-br from-slate-900 via-slate-950 to-black">
                    <div className="flex items-center justify-between gap-4 md:gap-8">
                      <div className="text-center md:text-left flex-1">
                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${homeTeam === "Westgate" ? "text-red-500" : "text-slate-500"}`}>Home</span>
                        <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter mt-1 leading-none">{homeTeam}</h3>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-sm font-black italic text-slate-500">VS</span>
                        </div>
                      </div>

                      <div className="text-center md:text-right flex-1">
                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${awayTeam === "Westgate" ? "text-red-500" : "text-slate-500"}`}>Away</span>
                        <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter mt-1 leading-none">{awayTeam}</h3>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-6 border-t border-white/5 pt-6">
                       <div className="flex items-center gap-2">
                          <Calendar className="text-red-600" size={16} />
                          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">{nextMatch.date_text} @ {nextMatch.time_text}</span>
                       </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="text-red-600" size={16} />
                        <button 
                          onClick={() => {
                            // Clean up the venue name and search it on Google Maps
                            const searchQuery = encodeURIComponent(`${nextMatch.venue}, Victoria, Australia`);
                            window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
                          }} 
                          className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors text-left"
                        >
                          {nextMatch.venue}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: STATUS PANEL */}
                  <div className={`lg:col-span-4 flex flex-col justify-center items-center p-8 text-center transition-colors duration-1000 ${timeLeft.status === 'LIVE' ? 'bg-red-700' : 'bg-red-600'}`}>
                    {timeLeft.status === 'LIVE' ? (
                      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
                        <p className="text-white text-xl font-black uppercase italic tracking-tighter leading-tight">Kickoff Started</p>
                      </div>
                    ) : (
                      <div className="w-full">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60 block mb-4">Kickoff Countdown</span>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { label: 'Days', val: timeLeft.days },
                            { label: 'Hours', val: timeLeft.hours },
                            { label: 'Minutes', val: timeLeft.minutes },
                            { label: 'Seconds', val: timeLeft.seconds }
                          ].map((unit, i) => (
                            <div key={i} className="flex flex-col bg-black/10 rounded-lg py-2">
                              <span className="text-xl md:text-2xl font-black italic tracking-tighter tabular-nums text-white leading-none">
                                {String(unit.val).padStart(2, '0')}
                              </span>
                              <span className="text-[8px] font-bold uppercase text-white/40 mt-1">{unit.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // This is the OFF-SEASON card if there is no future senior mens matches in the DB
            <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] border border-slate-800 p-12 md:p-20 text-center max-w-5xl mx-auto shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
                <h1 className="text-[120px] md:text-[200px] font-black italic uppercase">Westgate</h1>
              </div>
              
              <div className="relative z-10">
                <span className="bg-red-600 text-white text-[10px] font-black uppercase px-6 py-2 rounded-full tracking-[0.3em] mb-6 inline-block shadow-lg">
                  Status: Off-Season
                </span>
                <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 text-white">
                  The hard work <span className="text-red-600">never stops.</span>
                </h3>
                <p className="text-slate-400 max-w-xl mx-auto mb-8 font-medium italic not-italic text-sm md:text-base leading-relaxed">
                  Preparing for the 2026 Season. Keep an eye on our latest news for trial dates, community events, and fixture announcements.
                </p>
                <Link href="/pages/news"> 
                  <button className="border border-slate-700 hover:bg-white hover:text-black transition-all px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest text-white shadow-xl">
                    Follow the preparation
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* THE NEWS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 italic">Latest News</h2>
            <div className="h-2 w-16 bg-red-600 mt-4"></div>
          </div>

          {/* Navigation to the news page */}
          <Link href="/pages/news" className="group flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-red-600 transition-colors">
            All News <ArrowRight size={15} />
          </Link>
        </div>
        
        {/* The 3 card section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.length > 0 && (
            <>
              {/* The big latest news box */}
              <Link href={`/pages/news/${latestNews[0].id}`} className="md:col-span-2 relative h-[450px] rounded-3xl overflow-hidden group shadow-xl">
                <img src={latestNews[0].image_url} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-8">
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-4 leading-tight">{latestNews[0].title}</h3>
                  <p className="text-slate-300 line-clamp-2 italic not-italic text-sm">{latestNews[0].content}</p>
                </div>
              </Link>

              {/* The 2nd and 3rd latest news boxes */}
              <div className="flex flex-col gap-6">
                {latestNews.slice(1, 3).map((news) => (
                  <Link key={news.id} href={`/pages/news/${news.id}`} className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                    <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                      <img src={news.image_url} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" />
                    </div>
                    <h4 className="text-lg font-black uppercase text-slate-900 italic leading-tight">{news.title}</h4>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      

      {/* THE LITTLE ABOUT US SECTION AND A BUTOTN LINK TO THE ABOUT US PAGE */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 mb-4">Our Legacy</h2>
            <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 mb-6 italic leading-none">Faith.<br/>Family.<br/>Sindjelic.</h3>
            <p className="text-slate-600 leading-relaxed mb-8 italic not-italic">Founded on principles of community and heritage, Westgate Sindjelic is more than a football club. We are a family.</p>
            
            {/* The navigation button to the aboutUs page */}
            <Link href="/pages/aboutUs">
              <button className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-600 transition-colors shadow-lg">Learn Our Story</button>
            </Link>
          </div>
          <div className="md:w-1/2 relative h-[350px] md:h-[500px] w-full">
            <Image src="/sindjelic.png" alt="Heritage" fill className="object-contain" />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}