'use client';
import React, { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import NewsCard, { News } from '@/components/NewsCard';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchNews = async () => {
      const { data } = await supabaseClient.from('news').select('*').eq('published', true).order('created_at', { ascending: false });
      setNews(data as News[] || []);
    };
    fetchNews();
  }, []);

  if (!isMounted) return null;

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />
      <Hero heading="Club News" message="The latest updates from Westgate Sindjelic FC" />
      <div className="max-w-4xl mx-auto px-6 py-12">
        {news.length === 0 ? (
          <p className="text-center text-gray-500 py-20 font-medium">No news available at the moment.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {news.map((item) => <NewsCard key={item.id} news={item} />)}
          </div>
        )}
      </div>
    </main>
  );
}