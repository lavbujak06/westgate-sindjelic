'use client';
import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session?.user?.id) { router.push('/login'); return; }
      const { data: adminData, error } = await supabaseClient.from('admins').select('*').eq('id', session.user.id).single();
      if (error || !adminData) { router.push('/login'); return; }
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-red-600 font-black animate-pulse uppercase tracking-widest">Initialising Secure Session...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-black uppercase tracking-tighter">Command <span className="text-red-600 underline decoration-4">Center</span></h1>
          <p className="text-slate-500 font-mono mt-2">Westgate Sindjelic FC — Administrative Access Level 1</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900 border-l-4 border-red-600 p-6 rounded-r-xl">
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">Active Members</h3>
            <p className="text-4xl font-black mt-2">1,284</p>
          </div>
          <div className="bg-slate-900 border-l-4 border-slate-700 p-6 rounded-r-xl">
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">News Items</h3>
            <p className="text-4xl font-black mt-2">56</p>
          </div>
          <div className="bg-slate-900 border-l-4 border-green-600 p-6 rounded-r-xl">
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">System Health</h3>
            <p className="text-4xl font-black mt-2 text-green-500">100%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/news" className="group bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-red-600 transition-all">
            <h2 className="text-2xl font-bold group-hover:text-red-500 transition-colors">Manage News Content →</h2>
            <p className="text-slate-500 mt-2 text-sm">Create, edit, and publish club updates to the front page.</p>
          </Link>
          <Link href="/admin/coaches" className="group bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-red-600 transition-all">
            <h2 className="text-2xl font-bold group-hover:text-red-500 transition-colors">Coaches Archive →</h2>
            <p className="text-slate-500 mt-2 text-sm">Manage coaching staff and their profiles.</p>
          </Link>
          <Link href="/admin/league" className="group bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-red-600 transition-all">
            <h2 className="text-2xl font-bold group-hover:text-red-500 transition-colors">League Database →</h2>
            <p className="text-slate-500 mt-2 text-sm">Manage league data and standings.</p>
          </Link>
          <Link href="/admin/gallery" className="group bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-red-600 transition-all">
            <h2 className="text-2xl font-bold group-hover:text-red-500 transition-colors">Team Gallery →</h2>
            <p className="text-slate-500 mt-2 text-sm">Manage team photos and media content.</p>
          </Link>
          <Link href="/admin/coaches" className="group bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-red-600 transition-all">
            <h2 className="text-2xl font-bold group-hover:text-red-500 transition-colors">Coaches Archive →</h2>
            <p className="text-slate-500 mt-2 text-sm">Manage coaching staff and their profiles.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}