// frontend/src/app/admin/news/page.tsx
'use client';
import React, { useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import CreateButton from './components/CreateButton';
import NewsCard from './components/NewsCard';

async function getNews() {
  const { data, error } = await supabaseClient
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export default function AdminNewsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [news, setNews] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const newsData = await getNews();
      setNews(newsData);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabaseClient
      .from('news')
      .insert([{ title, content, published: false }]);
    if (error) { console.error('Supabase insert error:', error); return; }
    setTitle(''); setContent('');
    const newsData = await getNews();
    setNews(newsData);
  };

  return (
    <div className="space-y-6">
      <CreateButton />

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
        <button type="submit">Create</button>
      </form>

      <div className="flex flex-col gap-4">
        {news?.map((item: any) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </div>
  );
}
