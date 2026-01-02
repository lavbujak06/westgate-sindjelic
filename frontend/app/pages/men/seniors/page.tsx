'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

type Ladder = { pos: string; team: string; p: string; w: string; d: string; l: string; f: string; a: string; gd: string; pts: string; };
type Game = { round: string; date: string; time: string; venue: string; wscore: string; opponent: string; ascore: string; };

export default function MensPage() {
  const [ladder, setLadder] = useState<Ladder[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/mens/ladder')
      .then(res => res.json())
      .then(data => Array.isArray(data) && setLadder(data))
      .catch(err => console.error('Error fetching ladder:', err));

    fetch('http://localhost:5001/api/mens/games')
      .then(res => res.json())
      .then(data => Array.isArray(data) && setGames(data))
      .catch(err => console.error('Error fetching games:', err));
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen pb-20">
      <Navbar />
      <Hero heading="Senior Men" message="State League 1 North-West" showButton={false} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-30">
        {/* LADDER SECTION */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-12">
          <div className="bg-red-700 px-6 py-4">
            <h2 className="text-white font-bold uppercase tracking-wider">League Table</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-xs uppercase font-bold">
                  <th className="px-4 py-3">Pos</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">P</th><th className="px-4 py-3">W</th>
                  <th className="px-4 py-3">D</th><th className="px-4 py-3">L</th>
                  <th className="px-4 py-3">GD</th><th className="px-4 py-3">Pts</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {ladder.map((t, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-4 font-black text-red-600">{t.pos}</td>
                    <td className="px-4 py-4 font-bold">{t.team}</td>
                    <td className="px-4 py-4">{t.p}</td><td className="px-4 py-4">{t.w}</td>
                    <td className="px-4 py-4">{t.d}</td><td className="px-4 py-4">{t.l}</td>
                    <td className="px-4 py-4 font-medium">{t.gd}</td>
                    <td className="px-4 py-4 font-black">{t.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GAMES SECTION */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-black px-6 py-4">
            <h2 className="text-white font-bold uppercase tracking-wider">Fixtures & Results</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-xs uppercase font-bold">
                  <th className="px-4 py-3">Rnd</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3 text-center">Score</th>
                  <th className="px-4 py-3">Opponent</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {games.map((g, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-4 font-bold text-gray-400">{g.round}</td>
                    <td className="px-4 py-4">
                      <p className="font-bold">{g.date}</p>
                      <p className="text-xs text-gray-500">{g.time}</p>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 italic max-w-[150px]">{g.venue}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2 bg-gray-100 rounded py-1 px-2 font-black">
                        <span>{g.wscore}</span><span>-</span><span>{g.ascore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold uppercase tracking-tight text-red-700">{g.opponent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}