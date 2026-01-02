'use client';
import React from 'react';
import Link from 'next/link';
import Switch from './Switch';
import { News } from '../types';

interface NewsCardProps {
  news: News;
  onDelete?: () => void;
  onTogglePublish?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onDelete, onTogglePublish }) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4 hover:border-slate-700 transition-all group">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors">{news.title}</h3>
          <p className="text-sm text-slate-500 line-clamp-2 italic">{news.content}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
          <span className="text-[10px] font-black uppercase text-slate-500 mr-1">Live</span>
          <Switch checked={news.published} onToggle={onTogglePublish} />
        </div>
      </div>
      
      <div className="flex items-center gap-3 pt-2 border-t border-slate-800/50">
        <Link href={`/admin/news/edit/${news.id}`}>
          <button className="text-[10px] font-black uppercase tracking-widest bg-blue-900/20 text-blue-400 border border-blue-900/30 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all">Edit Page</button>
        </Link>
        <button onClick={onDelete} className="text-[10px] font-black uppercase tracking-widest bg-red-900/20 text-red-500 border border-red-900/30 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all">Delete</button>
      </div>
    </div>
  );
};

export default NewsCard;