'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Coach {
  id: string;
  name: string;
  image_url: string;
  team_slug: string;
  role: string;
}

export default function CoachesAdminDashboard() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSlug, setFilterSlug] = useState('all');

  const fetchCoaches = async () => {
    const res = await fetch('http://localhost:5001/api/coaches');
    const data = await res.json();
    setCoaches(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchCoaches(); }, []);

  // --- LOGIC: FILTER & GROUP ---
  const groupedCoaches = useMemo(() => {
    return coaches
      .filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterSlug === 'all' || c.team_slug === filterSlug;
        return matchesSearch && matchesFilter;
      })
      .reduce((acc: Record<string, Coach[]>, coach) => {
        const team = coach.team_slug || 'Unassigned';
        if (!acc[team]) acc[team] = [];
        acc[team].push(coach);
        return acc;
      }, {});
  }, [coaches, searchQuery, filterSlug]);

  // Extract unique slugs for the filter dropdown
  const uniqueSlugs = useMemo(() => 
    Array.from(new Set(coaches.map(c => c.team_slug))), 
  [coaches]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(`http://localhost:5001/api/coaches/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      toast.success('Coach removed');
      setCoaches(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase italic">Personnel <span className="text-red-600">Control</span></h1>
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mt-1">Manage club coaching staff</p>
          </div>
          <Link href="/admin/coaches/new" className="bg-red-600 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
            Add New Staff
          </Link>
        </div>

        {/* --- FILTER BAR --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <input 
            type="text"
            placeholder="Search by name..."
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-600 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-600 outline-none uppercase font-bold text-[10px] tracking-widest cursor-pointer"
            value={filterSlug}
            onChange={(e) => setFilterSlug(e.target.value)}
          >
            <option value="all">All Teams</option>
            {uniqueSlugs.map(slug => (
              <option key={slug} value={slug}>{slug.replace('-', ' ')}</option>
            ))}
          </select>
        </div>

        {/* --- RENDER SECTIONS --- */}
        <div className="space-y-12">
          {Object.entries(groupedCoaches).length > 0 ? (
            Object.entries(groupedCoaches).map(([team, members]) => (
              <div key={team}>
                {/* SUBHEADING STYLE */}
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">
                    {team.replace('-', ' ')}
                  </h2>
                  <div className="h-px grow bg-slate-800/50"></div>
                  <span className="text-[9px] font-mono text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                    {members.length} UNITS
                  </span>
                </div>

                <div className="grid gap-3">
                  {members.map((coach) => (
                    <div key={coach.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-slate-600 transition-all">
                      <div className="flex items-center gap-4">
                        <img src={coach.image_url} className="w-12 h-12 rounded-full object-cover border border-slate-800 group-hover:border-red-600 transition-colors" />
                        <div>
                          <p className="font-bold text-sm">{coach.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">{coach.role.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/coaches/${coach.id}`} className="text-[10px] font-black uppercase tracking-widest bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700">Edit</Link>
                        <button onClick={() => handleDelete(coach.id)} className="text-[10px] font-black uppercase tracking-widest bg-red-900/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-900/30">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">
              <p className="text-slate-600 font-black uppercase text-xs tracking-widest">No matching personnel records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}