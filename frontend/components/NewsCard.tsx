import React from 'react';

export interface News {
  id: string; title: string; content: string; published: boolean; created_at: string;
}

const NewsCard: React.FC<{ news: News }> = ({ news }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-200">
      <h2 className="text-2xl font-bold text-gray-900 leading-tight">{news.title}</h2>
      <p className="text-gray-600 leading-relaxed line-clamp-3">{news.content}</p>
      <span className="text-sm font-medium text-gray-400 self-end uppercase tracking-wider">
        {new Date(news.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </span>
    </div>
  );
};
export default NewsCard;