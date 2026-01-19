'use client';
import React, { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Hero from '@/components/Hero';
import { News } from '@/app/types';

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabaseClient
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      setNews(data as News[]|| []);
    };
    fetchNews();
  }, []);

  const heroNews = news.slice(0, 3); // Top 3 for the Slider
  const remainingNews = news.slice(3); // The rest for the Grid

  return (
    <main className="bg-[#f8f9fa] min-h-screen pb-20 italic">
      <Navbar />

      <Hero 
        heading='Westgate Sindjelic' 
        message='Latest News and Updates' 
      />

      {/* BAYERN ACCORDION SLIDER */}
      <section className="flex flex-col md:flex-row w-full h-[70vh] md:h-[600px] overflow-hidden bg-black">
        {heroNews.map((item, index) => (
          <Link 
            key={item.id} 
            href={`/pages/news/${item.id}`} // Redirects to [id]/page.tsx
            className="relative flex-1 hover:flex-[2.5] transition-all duration-700 ease-in-out group overflow-hidden border-r border-white/10 last:border-none"
          >
            {/* Background Image */}
            <img 
              src={item.image_url || '/placeholder.jpg'} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
              alt={item.title}
            />
            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
            
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="text-red-600 font-black text-[10px] uppercase tracking-widest bg-white px-2 py-1 mb-4 inline-block">
                News Article {index + 1}
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-red-500 mb-2 transition-colors">
                {item.title}
              </h2>
              
              {/* TRUNCATED CONTENT: Visible only on hover/extension */}
              <p className="text-slate-300 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 line-clamp-2 max-w-md">
                {item.content.substring(0, 120)}...
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* REMAINING NEWS GRID */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-10 border-b pb-4">More Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {remainingNews.map((item) => (
            <Link key={item.id} href={`/pages/news/${item.id}`} className="group">
              <div className="aspect-video overflow-hidden rounded-2xl mb-4 bg-slate-200">
                <img 
                  src={item.image_url || '/placeholder.jpg'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt=""
                />
              </div>
              <p className="text-[10px] font-black text-red-600 uppercase mb-1 tracking-widest">News Article</p>
              <h4 className="text-xl font-black uppercase italic tracking-tighter leading-tight mb-2 group-hover:underline">
                {item.title}
              </h4>
              {/* TRUNCATED GRID CONTENT */}
              <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2 italic">
                {item.content.substring(0, 85)}...
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}