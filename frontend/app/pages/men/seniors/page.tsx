'use client';
import { useEffect, useState } from 'react';

type Ladder = {
  pos: string; 
  team: string; 
  p: string; 
  w: string; 
  d: string; 
  l: string; 
  f: string; 
  a: string; 
  gd: string; 
  pts: string;
};

type Game = {
  round: string; 
  date: string; 
  time: string; 
  venue: string; 
  wscore: string; 
  opponent: string; 
  ascore: string;
};

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
    <div className="mens-page-wrapper">
      <h1 className="page-title">Men&apos;s Ladder</h1>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>POS</th><th>TEAM</th><th>P</th><th>W</th><th>D</th>
              <th>L</th><th>F</th><th>A</th><th>GD</th><th>PTS</th>
            </tr>
          </thead>
          <tbody>
            {ladder.map((t, i) => (
              <tr key={i}>
                <td className="bold">{t.pos}</td>
                <td className="text-left">{t.team}</td>
                <td>{t.p}</td><td>{t.w}</td><td>{t.d}</td><td>{t.l}</td>
                <td>{t.f}</td><td>{t.a}</td><td>{t.gd}</td>
                <td className="bold">{t.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="page-title" style={{ marginTop: '3rem' }}>Games & Fixtures</h2>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>RND</th>
              <th>DATE & TIME</th>
              <th>VENUE</th>
              <th>HOME SCORE</th>
              <th>OPPONENT</th>
              <th>AWAY SCORE</th>
            </tr>
          </thead>
          <tbody>
            {games.map((g, i) => (
              <tr key={i}>
                <td>{g.round}</td>
                <td>{g.date}<br/><small>{g.time}</small></td>
                <td className="venue-cell">{g.venue}</td>
                <td className="score-cell">{g.wscore}</td>
                <td className="opponent-cell">{g.opponent}</td>
                <td className="score-cell">{g.ascore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}