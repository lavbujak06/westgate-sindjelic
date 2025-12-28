'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabaseClient';
import CreateButton from '@/components/CreateButton';
// import NewsCard from './components/NewsCard';
import NewsCard from '../components/NewsCard';
import { News } from '../types';

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);

  const fetchNews = async () => {
    const { data, error } = await supabaseClient
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return console.error(error);
    setNews((data as News[]) || []);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news?')) return;
    const { error } = await supabaseClient.from('news').delete().eq('id', id);
    if (error) return console.error(error);
    setNews(news.filter((n) => n.id !== id));
  };

  const handleTogglePublish = async (id: string, currentState: boolean) => {
    const { error } = await supabaseClient
      .from('news')
      .update({ published: !currentState })
      .eq('id', id);
    if (error) return console.error(error);
    setNews(news.map((n) => (n.id === id ? { ...n, published: !currentState } : n)));
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/news/new">
        <CreateButton>Create News</CreateButton>
      </Link>

      <div className="flex flex-col gap-4">
        {news.map((item) => (
          <NewsCard
            key={item.id}
            news={item}
            onDelete={() => handleDelete(item.id)}
            onTogglePublish={() => handleTogglePublish(item.id, item.published)}
          />
        ))}
      </div>
    </div>
  );
}
