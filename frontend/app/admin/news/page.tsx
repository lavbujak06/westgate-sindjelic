'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabaseClient';
import CreateButton from '@/components/CreateButton';
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

  useEffect(() => { fetchNews(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news?')) return;
    try {
      const res = await fetch('http://localhost:5001/api/news/' + id, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) { setNews(news.filter((n) => n.id !== id)); }
    } catch (error) { alert('An error occurred while deleting.'); }
  };

  const handleTogglePublish = async (id: string, currentState: boolean) => {
    try {
      const res = await fetch('http://localhost:5001/api/news/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentState }),
        credentials: 'include',
      });
      if (res.ok) {
        setNews(news.map((n) => n.id === id ? { ...n, published: !currentState } : n));
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <header>
            <h1 className="text-4xl font-black uppercase tracking-tighter">News <span className="text-red-600">Archive</span></h1>
            <p className="text-slate-500 text-xs font-mono mt-1 uppercase tracking-widest italic">Database Read/Write Access</p>
          </header>
          <Link href="/admin/news/new">
            <CreateButton>Create New Entry</CreateButton>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
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
    </div>
  );
}