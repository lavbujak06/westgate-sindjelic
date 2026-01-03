'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CoachesAdminDashboard() {
  const [coaches, setCoaches] = useState([]);

  const fetchCoaches = async () => {
    const res = await fetch('http://localhost:5001/api/coaches');
    const data = await res.json();
    setCoaches(data);
  };

  useEffect(() => { fetchCoaches(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this coach?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/coaches/${id}`, {
        method: 'DELETE',
        credentials: 'include', // <--- REQUIRED FOR AUTH
      });
      if (res.ok) {
        toast.success('Coach deleted');
        setCoaches(coaches.filter((c: any) => c.id !== id));
      } else {
        toast.error('Unauthorized: You must be an admin');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black uppercase italic">Manage <span className="text-red-600">Coaches</span></h1>
        <Link href="/admin/coaches/new" className="bg-red-600 px-6 py-2 rounded-full font-bold uppercase text-xs">Add New Coach</Link>
      </div>

      <div className="grid gap-4">
        {coaches.map((coach: any) => (
          <div key={coach.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={coach.image_url} className="w-12 h-12 rounded-full object-cover border border-red-600" />
              <div>
                <p className="font-bold">{coach.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{coach.team_slug} — {coach.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/coaches/${coach.id}`} className="text-xs bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700">Edit</Link>
              <button onClick={() => handleDelete(coach.id)} className="text-xs bg-red-900/20 text-red-500 px-4 py-2 rounded-lg hover:bg-red-900/40">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}