'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '' },
    { label: 'News Archive', href: '/admin/news', icon: '' },
    { label: 'Coaches Archive', href: '/admin/coaches', icon: '' },
    { label: 'League Database', href: '/admin/league', icon: '' },
    { label: 'User Accounts', href: '/admin/accounts', icon: '' },
    { label: 'Team Gallery', href: '/admin/gallery', icon: '' },
    { label: 'Security Logs', href: '/admin/audit-logs', icon: '' },
  ];

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#020617] font-sans selection:bg-red-500/30">
        
        {/* SIDEBAR: Tactical Command Navigation */}
        <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800 flex flex-col fixed inset-y-0 z-50">
          
          {/* Brand/Header */}
          <div className="p-8">
            <h2 className="text-white text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              <span className="w-2 h-6 bg-red-600"></span> 
              Sindjelic <span className="text-red-600">HQ</span>
            </h2>
            <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">Command Interface v1.0</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    isActive 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                      : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-lg opacity-80">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer / Exit */}
          <div className="p-4 mt-auto">
            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
              <Link 
                href="/" 
                className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                <span>←</span> Return to Front
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 ml-64 min-h-screen relative">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-900/5 blur-[120px] -z-10" />
          
          <div className="p-8 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}