'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CoachStaff from '@/components/CoachStuff';
import StatBox from '@/components/StatBox';
import MatchSlider from '@/components/MatchSlider';
import { Calendar, Loader2, Trophy, Clock, MapPin } from 'lucide-react';

type LadderRow = { pos: number; team: string; p: number; w: number; d: number; l: number; gd: number; pts: number; };
type GameRow = { round: string; date_text: string; time_text: string; venue: string; w_score: string; a_score: string; opponent: string; };
type Config = { id: string; season_year: number; team_name: string; };
type MediaItem = { id: string; url: string };

export default function ReserveWomenPage() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [ladder, setLadder] = useState<LadderRow[]>([]);
  const [games, setGames] = useState<GameRow[]>([]);
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/league/configs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Filter specifically for "Reserve Women"
          const reserveWomenOnly = data.filter(c => c.team_name === 'Reserve Women');
          setConfigs(reserveWomenOnly);
          if (reserveWomenOnly.length > 0) setSelectedConfigId(reserveWomenOnly[0].id);
        }
      });

    fetch('http://localhost:5001/api/media/reserve-women')
      .then(res => res.json())
      .then(data => setGallery(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (!selectedConfigId) return;
    async function loadSeasonData() {
      setLoading(true);
      try {
        const [lRes, gRes] = await Promise.all([
          fetch(`http://localhost:5001/api/league/ladder/${selectedConfigId}`),
          fetch(`http://localhost:5001/api/league/games/${selectedConfigId}`)
        ]);
        setLadder(await lRes.json());
        setGames(await gRes.json());
      } finally {
        setLoading(false);
      }
    }
    loadSeasonData();
  }, [selectedConfigId]);

  const wgStats = ladder.find(t => 
    t.team.toLowerCase().includes("westgate") || t.team.toLowerCase().includes("sindjelic")
  );

  const lastFiveForm = [...games]
    .filter(g => g.w_score !== null && g.w_score !== "" && g.a_score !== null && g.a_score !== "")
    .sort((a, b) => parseInt(b.round) - parseInt(a.round))
    .slice(0, 5)
    .map(g => {
      const home = parseInt(g.w_score);
      const away = parseInt(g.a_score);
      if (home > away) return { label: 'W', color: 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] border-green-400' };
      if (home < away) return { label: 'L', color: 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] border-red-400' };
      return { label: 'D', color: 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.6)] border-gray-400' };
    });

  return (
    <main className="bg-[#fcfcfc] min-h-screen pb-20 overflow-x-hidden">
      <Navbar />
      <Hero heading="Reserve Women" message="State League Women's Reserves" showButton={false} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
          <div className="flex flex-wrap items-center gap-4 order-2 md:order-1">
            <StatBox label="Position" value={wgStats?.pos} color="text-red-600" />
            <StatBox label="Points" value={wgStats?.pts} color="text-black" />
            <StatBox label="Wins" value={wgStats?.w} color="text-gray-600" />

            {lastFiveForm.length > 0 && (
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-black/5 border border-white flex flex-col items-center justify-center min-w-[180px]">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Recent Form</span>
                    <div className="flex gap-2">
                        {lastFiveForm.map((game, idx) => (
                            <div key={idx} className={`${game.color} w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 backdrop-blur-sm bg-opacity-80 transition-transform hover:scale-110`}>
                                {game.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl shadow-xl shadow-black/5 border border-gray-100 flex items-center gap-4 self-end order-1 md:order-2">
            <div className="bg-red-50 p-2 rounded-lg"><Calendar size={18} className="text-red-600" /></div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Select Season</span>
                <select value={selectedConfigId} onChange={(e) => setSelectedConfigId(e.target.value)} className="bg-transparent text-sm font-black uppercase outline-none cursor-pointer text-gray-900">
                    {configs.map(c => <option key={c.id} value={c.id}>{c.season_year} {c.team_name}</option>)}
                </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-32 shadow-xl flex flex-col items-center justify-center border border-gray-50">
            <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
            <p className="text-gray-400 font-black uppercase text-xs tracking-[0.3em]">Loading Records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden border border-gray-100">
                    <div className="bg-red-700 px-8 py-6 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Trophy className="text-red-200" size={20} />
                            <h2 className="text-white font-black uppercase tracking-tighter text-xl italic">League Table</h2>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                                    <th className="px-8 py-5">Pos</th>
                                    <th className="px-8 py-5">Team</th>
                                    <th className="px-4 py-5 text-center">P</th>
                                    <th className="px-4 py-5 text-center">W</th>
                                    <th className="px-4 py-5 text-center">D</th>
                                    <th className="px-4 py-5 text-center">L</th>
                                    <th className="px-4 py-5 text-center">GD</th>
                                    <th className="px-8 py-5 text-right">Pts</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {ladder.map((t, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-red-50/30 transition-colors group">
                                        <td className="px-8 py-5 font-black text-red-600 italic text-lg">{t.pos}</td>
                                        <td className="px-8 py-5 font-bold text-gray-800 group-hover:text-red-700 transition-colors uppercase tracking-tight">{t.team}</td>
                                        <td className="px-4 py-5 text-center font-medium text-gray-500">{t.p}</td>
                                        <td className="px-4 py-5 text-center font-medium text-gray-500">{t.w}</td>
                                        <td className="px-4 py-5 text-center font-medium text-gray-500">{t.d}</td>
                                        <td className="px-4 py-5 text-center font-medium text-gray-500">{t.l}</td>
                                        <td className="px-4 py-5 text-center font-bold text-gray-600">{t.gd}</td>
                                        <td className="px-8 py-5 text-right font-black text-gray-900 text-base">{t.pts}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden border border-gray-100 flex flex-col h-full">
                    <div className="bg-black px-8 py-6">
                        <h2 className="text-white font-black uppercase tracking-tighter text-xl italic">Fixtures & Results</h2>
                    </div>
                    <div className="p-4 overflow-y-auto max-h-[850px] space-y-4">
                        {games.map((g, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-red-200 transition-all">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-black bg-gray-200 text-gray-600 px-2 py-1 rounded-md uppercase">Round {g.round}</span>
                                    <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold"><Clock size={12} /> {g.time_text}</div>
                                </div>
                                <div className="flex flex-col gap-1 mb-4">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{g.date_text}</p>
                                    <div className="flex items-center gap-1 text-gray-500 text-[10px]"><MapPin size={10} /> <span className="truncate">{g.venue}</span></div>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 text-right">
                                        <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Westgate FC</p>
                                        <span className="text-2xl font-black italic">{g.w_score || '-'}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs italic">VS</div>
                                    <div className="flex-1 text-left">
                                        <p className="text-[10px] font-black uppercase text-red-600 mb-1 truncate">{g.opponent}</p>
                                        <span className="text-2xl font-black italic">{g.a_score || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>

      {gallery.length > 0 && !loading && (
        <section className="w-full mb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
            <h2 className="text-black font-black uppercase tracking-tighter text-4xl italic">
              Team <span className="text-red-600">Gallery</span>
            </h2>
          </div>
          <div className="w-full">
            <MatchSlider slides={gallery} />
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <CoachStaff teamSlug="reserve-women" />
      </div>
    </main>
  );
}