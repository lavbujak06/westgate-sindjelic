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
  teamSlug: string; // e.g., 'senior-men', 'juniors', etc.
}

const CoachStaff = ({ teamSlug }: CoachStaffProps) => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch only the coaches for the specific teamSlug provided to this component
    fetch(`http://localhost:5001/api/coaches?team=${teamSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCoaches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching coaches:', err);
        setLoading(false);
      });
  }, [teamSlug]);

  if (loading) return <div className="text-center py-10 text-gray-400 font-mono text-xs uppercase">Loading Staff...</div>;
  if (coaches.length === 0) return null;

  // Separate Head Coach for a bigger display
  const headCoach = coaches.find((c) => c.role === 'head_coach');
  const assistants = coaches.filter((c) => c.role === 'assistant_coach');

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black uppercase italic text-gray-900">
          Technical <span className="text-red-700">Staff</span>
        </h2>
        <div className="h-1 w-12 bg-red-600 mx-auto mt-2" />
      </div>

      <div className="flex flex-col items-center gap-12">
        {/* Head Coach Display */}
        {headCoach && (
          <div className="flex flex-col items-center group">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-red-600 shadow-2xl transition-transform group-hover:scale-105">
              <img src={headCoach.image_url} alt={headCoach.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="mt-4 text-xl font-black uppercase text-gray-900">{headCoach.name}</h3>
            <p className="text-red-600 font-bold uppercase text-xs tracking-widest">Head Coach</p>
          </div>
        )}

        {/* Assistants Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {assistants.map((coach) => (
            <div key={coach.id} className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mb-4">
                <img src={coach.image_url} alt={coach.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-sm font-bold uppercase text-gray-900">{coach.name}</h4>
              <p className="text-gray-500 font-medium text-[10px] uppercase tracking-tighter">Assistant Coach</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoachStaff;