'use client';
import { useEffect, useState, useRef } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({ db: 0, storage: 0 });
  const hasSentAlert = useRef(false);
  const router = useRouter();

  // Limits for Supabase Free Tier
  const DB_LIMIT_MB = 500;
  const STORAGE_LIMIT_MB = 1024;

  useEffect(() => {
    const checkAdminAndFetchUsage = async () => {
      // 1. Security Check
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session?.user?.id) { router.push('/login'); return; }
      
      const { data: adminData, error } = await supabaseClient
        .from('admins')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error || !adminData) { router.push('/login'); return; }

      // 2. Fetch Usage Stats via SQL RPC
      const { data: usageData, error: usageError } = await supabaseClient.rpc('get_project_usage');
      
      if (!usageError && usageData) {
        const dbMB = Number((usageData.db_bytes / (1024 * 1024)).toFixed(1));
        const storageMB = Number((usageData.storage_bytes / (1024 * 1024)).toFixed(1));
        
        setUsage({ db: dbMB, storage: storageMB });

        // 3. Trigger Email Alert if > 80% (Once per session)
        const isDbCritical = dbMB > (DB_LIMIT_MB * 0.8);
        const isStorageCritical = storageMB > (STORAGE_LIMIT_MB * 0.8);

        if ((isDbCritical || isStorageCritical) && !hasSentAlert.current) {
          hasSentAlert.current = true;
          console.log("Sending the storage warning email...");
          try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/system-alert`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ db: dbMB, storage: storageMB })
            });
          } catch (e) {
            console.error("System alert failed to send:", e);
            hasSentAlert.current = false;
          }
        }
      }

      setLoading(false);
    };

    checkAdminAndFetchUsage();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-red-600 font-black animate-pulse uppercase tracking-widest">
      Initialising Secure Session...
    </div>
  );

  // Health Status Logic
  const dbWarning = usage.db > (DB_LIMIT_MB * 0.8);
  const storageWarning = usage.storage > (STORAGE_LIMIT_MB * 0.8);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      {/* SYSTEM ALERT BANNER */}
      {(dbWarning || storageWarning) && (
        <div className="bg-red-600/20 border border-red-600 p-4 rounded-xl mb-8 flex items-center gap-4 animate-pulse max-w-6xl mx-auto">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold text-red-500 uppercase text-xs tracking-widest">Resource Capacity Warning</p>
            <p className="text-sm text-slate-300 italic">
              A system report has been sent to your email. You are approaching the 500MB/1GB Free Tier limit.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-black uppercase tracking-tighter">Command <span className="text-red-600 underline decoration-4">Center</span></h1>
          <p className="text-slate-500 font-mono mt-2">Westgate Sindjelic FC — Administrative Access Level 1</p>
        </header>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Database Box */}
          <div className={`bg-slate-900 border-l-4 ${dbWarning ? 'border-red-600' : 'border-green-500'} p-6 rounded-r-xl transition-colors`}>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">Database (Rows/Tables)</h3>
            <p className={`text-4xl font-black mt-2 ${dbWarning ? 'text-red-500' : 'text-white'}`}>
              {usage.db}<span className="text-lg text-slate-500"> / {DB_LIMIT_MB}MB</span>
            </p>
            <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
               <div 
                 className={`${dbWarning ? 'bg-red-600' : 'bg-blue-500'} h-full transition-all duration-1000`} 
                 style={{ width: `${Math.min((usage.db / DB_LIMIT_MB) * 100, 100)}%` }}
               ></div>
            </div>
          </div>

          {/* File Storage Box */}
          <div className={`bg-slate-900 border-l-4 ${storageWarning ? 'border-red-600' : 'border-green-500'} p-6 rounded-r-xl transition-colors`}>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">Storage (Media/Files)</h3>
            <p className={`text-4xl font-black mt-2 ${storageWarning ? 'text-red-500' : 'text-white'}`}>
               {usage.storage}<span className="text-lg text-slate-500"> / {STORAGE_LIMIT_MB}MB</span>
            </p>
            <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
               <div 
                 className={`${storageWarning ? 'bg-red-600' : 'bg-blue-500'} h-full transition-all duration-1000`} 
                 style={{ width: `${Math.min((usage.storage / STORAGE_LIMIT_MB) * 100, 100)}%` }}
               ></div>
            </div>
          </div>

          {/* Tier Status Box */}
          <div className="bg-slate-900 border-l-4 border-green-600 p-6 rounded-r-xl">
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">Tier Status</h3>
            <p className="text-4xl font-black mt-2 text-green-500">FREE</p>
            <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">Monitoring Active</p>
          </div>
        </div>

        {/* NAVIGATION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          <Link href="/admin/news" className="group bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-red-600 transition-all">
            <h2 className="text-2xl font-bold group-hover:text-red-500 transition-colors">Manage News Content →</h2>
            <p className="text-slate-500 mt-2 text-sm">Create, edit, and publish club updates.</p>
          </Link>
          <Link href="/admin/coaches" className="group bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-red-600 transition-all">
            <h2 className="text-2xl font-bold group-hover:text-red-500 transition-colors">Coaches Archive →</h2>
            <p className="text-slate-500 mt-2 text-sm">Manage coaching staff profiles.</p>
          </Link>
          <Link href="/admin/league" className="group bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-red-600 transition-all">
            <h2 className="text-2xl font-bold group-hover:text-red-500 transition-colors">League Database →</h2>
            <p className="text-slate-500 mt-2 text-sm">Update standings and league data.</p>
          </Link>
          <Link href="/admin/gallery" className="group bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-red-600 transition-all">
            <h2 className="text-2xl font-bold group-hover:text-red-500 transition-colors">Team Gallery →</h2>
            <p className="text-slate-500 mt-2 text-sm">Manage photos and media content.</p>
          </Link>
          <Link href="/admin/sponsors" className="group bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-red-600 transition-all">
            <h2 className="text-2xl font-bold group-hover:text-red-500 transition-colors">Sponsor Management →</h2>
            <p className="text-slate-500 mt-2 text-sm">Manage club partners and logos.</p>
          </Link>
          {/* To be used in the future */}
          {/* <Link href="/admin/highlights" className="group bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-red-600 transition-all">
            <h2 className="text-2xl font-bold group-hover:text-red-500 transition-colors">Highlights Management →</h2>
            <p className="text-slate-500 mt-2 text-sm">Manage team videos and game highlights.</p>
          </Link> */}
        </div>
      </div>
    </div>
  );
}