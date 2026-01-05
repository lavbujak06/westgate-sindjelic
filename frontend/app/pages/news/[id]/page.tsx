'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      const { data } = await supabaseClient
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setArticle(data);
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white italic font-black uppercase tracking-widest">Loading Report...</div>;
  if (!article) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white italic">Article Not Found</div>;

  return (
    <main className="bg-white min-h-screen italic">
      <Navbar />
      
      {/* HEADER SECTION */}
      <div className="relative h-[45vh] md:h-[55vh] w-full bg-black overflow-hidden">
        <img 
          src={article.image_url || '/placeholder.jpg'} 
          className="w-full h-full object-cover object-[center_25%] opacity-70"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/40" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-20">
          <div className="max-w-5xl mx-auto">
            <Link href="/news" className="flex items-center gap-2 text-red-600 font-black uppercase text-[10px] tracking-widest mb-4 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to News Hub
            </Link>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-[0.9] drop-shadow-sm">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-4xl mx-auto px-6 mt-12 pb-20">
        <div className="flex items-center gap-6 mb-10 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <Calendar size={14} className="text-red-600" />
            {new Date(article.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <Clock size={14} className="text-red-600" />
            {Math.ceil(article.content.split(' ').length / 100)} Min Read
          </div>
        </div>

        {/* flow-root: This is the Clearfix. 
            It ensures that the floating image stays INSIDE this div 
            and doesn't bleed into your footer or other sections.
        */}
        <div className="flow-root">
          {/* STATIONARY SIDE IMAGE */}
          <div className="float-right ml-8 mb-6 w-full md:w-1/2 lg:w-2/5">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border-8 border-white shadow-2xl bg-slate-100">
              <img 
                src={article.image_url || '/placeholder.jpg'} 
                className="w-full h-full object-cover" 
                alt="article visual" 
              />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-4 text-right pr-4">
              Direct Archive / Visual Asset
            </p>
          </div>

          {/* THE TEXT CONTENT */}
          <p className="text-xl text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
            {article.content}
          </p>
        </div>
      </div>
    </main>
  );
}