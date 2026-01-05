import { News } from '../app/admin/types';
import { Edit2, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface NewsCardProps {
  news: News;
  onDelete: () => void;
  onTogglePublish: () => void;
}

export default function NewsCard({ news, onDelete, onTogglePublish }: NewsCardProps) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-slate-600 transition-all">
      <div className="flex items-center gap-6">
        {/* THUMBNAIL PREVIEW */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
          {news.image_url ? (
            <img src={news.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
          ) : (
            <ImageIcon className="text-slate-800" size={24} />
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${news.published ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {news.published ? 'Live' : 'Draft'}
            </span>
            <span className="text-[10px] font-mono text-slate-600 uppercase">
              {new Date(news.created_at).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-bold text-lg uppercase tracking-tight line-clamp-1">{news.title}</h3>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onTogglePublish}
          className="p-3 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition-all"
          title={news.published ? "Unpublish" : "Publish"}
        >
          {news.published ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        
        {/* Link to your dynamic editor route */}
        <Link href={`/admin/news/edit/${news.id}`}>
          <div className="p-3 rounded-xl bg-slate-950 text-slate-400 hover:text-blue-500 border border-slate-800 transition-all cursor-pointer">
            <Edit2 size={16} />
          </div>
        </Link>

        <button 
          onClick={onDelete}
          className="p-3 rounded-xl bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-900/30 transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}