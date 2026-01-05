'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RefreshCw, Plus, Trash2, Database, AlertCircle, Filter } from 'lucide-react';

// Define a basic interface for our Config objects
interface LeagueConfig {
  id: string;
  season_year: number;
  team_name: string;
  ladder_url: string;
  fixtures_url: string;
}

export default function LeagueManagerPage() {
  const [configs, setConfigs] = useState<LeagueConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterYear, setFilterYear] = useState<string>('All');

  const [newConfig, setNewConfig] = useState({
    season_year: 2026,
    team_name: '',
    ladder_url: '',
    fixtures_url: ''
  });

  // 1. FETCH ALL CONFIGS
  const fetchConfigs = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/league/configs', {
        credentials: 'include' // Ensures session cookie is sent to check if you are admin
      });
      const data = await res.json();
      setConfigs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load configurations");
    }
  };

  useEffect(() => { fetchConfigs(); }, []);

  // 2. CREATE NEW CONFIG
  const handleCreateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/league/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newConfig),
      });

      if (res.status === 401) throw new Error("Unauthorized: Please log in as Admin");
      if (!res.ok) throw new Error("Failed to save config");

      toast.success("Season Added!");
      setNewConfig({ season_year: 2026, team_name: '', ladder_url: '', fixtures_url: '' });
      setShowForm(false);
      fetchConfigs();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETE CONFIG
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will remove the configuration and linked data mappings.")) return;
    
    try {
      const res = await fetch(`http://localhost:5001/api/league/configs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Delete failed");
      
      toast.success("Configuration Deleted");
      fetchConfigs();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // 4. TRIGGER SCRAPER SYNC
  const triggerSync = async (id: string) => {
    setLoading(true);
    const loadToast = toast.loading("Scraping GameDay data...");
    try {
      const res = await fetch(`http://localhost:5001/api/scraper/sync/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.status === 401) throw new Error("Unauthorized: Admin session required");
      if (!res.ok) throw new Error("Sync failed");
      
      toast.success("Database Updated Successfully", { id: loadToast });
    } catch (err: any) {
      toast.error(err.message, { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const availableYears = ['All', ...new Set(configs.map(c => c.season_year.toString()))].sort().reverse();
  const filteredConfigs = filterYear === 'All' 
    ? configs 
    : configs.filter(c => c.season_year.toString() === filterYear);

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              League <span className="text-red-600">Control</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-mono mt-2 uppercase tracking-[0.3em]">
              Authorized Admin Access Only
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
              <Filter size={14} className="text-slate-500 mr-2" />
              <select 
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer pr-4"
              >
                {availableYears.map(year => (
                  <option key={year} value={year} className="bg-slate-900">{year}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-white hover:text-black transition-all shadow-lg shadow-red-600/20"
            >
              {showForm ? 'Cancel' : <><Plus size={14} /> Add Season</>}
            </button>
          </div>
        </header>

        {/* Create Season Form */}
        {showForm && (
          <form onSubmit={handleCreateConfig} className="mb-12 p-8 bg-slate-900/50 rounded-[2rem] border border-slate-800 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 backdrop-blur-md">
            <div className="col-span-1">
              <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1">Year</label>
              <input required type="number" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-red-600 outline-none transition-all" value={newConfig.season_year} onChange={e => setNewConfig({...newConfig, season_year: parseInt(e.target.value)})} />
            </div>
            <div className="col-span-1">
              <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1">
                Team Category
              </label>
              <select 
                required 
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-red-600 outline-none transition-all text-white appearance-none cursor-pointer"
                value={newConfig.team_name} 
                onChange={e => setNewConfig({...newConfig, team_name: e.target.value})}
              >
                <option value="" disabled>Select a Team</option>
                <option value="Senior Men">Senior Men</option>
                <option value="Senior Women">Senior Women</option>
                <option value="Under 21 Men">Reserve Men</option>
                <option value="Junior Boys">Reserve Women</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-black uppercase text-red-500/60 mb-2 block ml-1">GameDay Ladder URL</label>
              <input required type="url" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-red-600 outline-none text-xs font-mono" value={newConfig.ladder_url} onChange={e => setNewConfig({...newConfig, ladder_url: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-black uppercase text-red-500/60 mb-2 block ml-1">GameDay Fixtures URL</label>
              <input required type="url" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-red-600 outline-none text-xs font-mono" value={newConfig.fixtures_url} onChange={e => setNewConfig({...newConfig, fixtures_url: e.target.value})} />
            </div>
            <button disabled={loading} type="submit" className="col-span-2 bg-white text-black p-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all">
              {loading ? 'Adding Season...' : 'Save Configuration'}
            </button>
          </form>
        )}

        {/* Season List */}
        <div className="grid gap-4">
          {filteredConfigs.map((config) => (
            <div key={config.id} className="group bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] flex items-center justify-between hover:border-slate-600 transition-all backdrop-blur-sm">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:border-red-600 transition-colors">
                  <Database size={20} className="text-slate-500 group-hover:text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tight">
                    {config.season_year} <span className="text-slate-500">{config.team_name}</span>
                  </h3>
                  <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-widest">Active Cache Connection</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => triggerSync(config.id)}
                  disabled={loading}
                  className="bg-slate-800 hover:bg-red-600 px-6 py-3 rounded-xl flex items-center gap-3 transition-all"
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Sync</span>
                </button>
                <button 
                  onClick={() => handleDelete(config.id)}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:bg-red-900/20 hover:border-red-900 text-slate-600 hover:text-red-500 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}