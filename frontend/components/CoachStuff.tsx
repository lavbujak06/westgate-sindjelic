'use client';
import { useEffect, useState } from 'react';

interface Coach {
  id: string;
  name: string;
  role: 'head_coach' | 'assistant_coach';
  image_url: string;
  team_slug: string;
}

interface CoachStaffProps {
  teamSlug: string; 
}

const CoachStaff = ({ teamSlug }: CoachStaffProps) => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coaches?team=${teamSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Sort so head_coach always comes first
          const sorted = [...data].sort((a) => (a.role === 'head_coach' ? -1 : 1));
          setCoaches(sorted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching coaches:', err);
        setLoading(false);
      });
  }, [teamSlug]);

  if (loading) return <div className="text-center py-10 text-gray-400 font-mono text-xs uppercase">Loading Staff...</div>;
  if (coaches.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
      <div className="flex items-end gap-4 mb-12">
        <h2 className="text-4xl font-black uppercase italic text-gray-900 tracking-tighter">
          Technical <span className="text-red-700">Staff</span>
        </h2>
        <div className="h-[2px] flex-1 bg-gray-100 mb-3" />
      </div>

      {/* Grid Layout: All coaches next to each other */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
        {coaches.map((coach) => (
          <div key={coach.id} className="group flex flex-col items-center">
            {/* 1. Removed rounded-full to prevent head-cropping 
                2. Added object-top so the crop starts at the head, not the chest
            */}
            <div className={`relative w-full aspect-[4/5] overflow-hidden rounded-2xl shadow-xl transition-all duration-500 group-hover:shadow-red-500/20 group-hover:-translate-y-2 ${coach.role === 'head_coach' ? 'border-2 border-red-600' : 'border border-gray-100'}`}>
              <img 
                src={coach.image_url} 
                alt={coach.name} 
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" 
              />
              
              {/* Subtle Role Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                 <p className={`text-[10px] font-black uppercase tracking-widest ${coach.role === 'head_coach' ? 'text-red-500' : 'text-gray-300'}`}>
                  {coach.role === 'head_coach' ? 'Head Coach' : 'Assistant Coach'}
                </p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg font-black uppercase italic text-gray-900 leading-tight">
                {coach.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoachStaff;