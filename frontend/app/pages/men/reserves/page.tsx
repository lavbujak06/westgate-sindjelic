// Example: app/pages/men/seniors/page.tsx
import CoachStaff from '@/components/CoachStuff';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';

export default function SeniorsMen() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <Hero heading="Senior Men" message="State League 1 North-West" showButton={false} />

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* LADDER SECTION */}
        <section>
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-red-600 pl-4">League Table</h2>
          <div className="w-full h-[500px] bg-gray-100 rounded-xl overflow-hidden shadow-inner">
            {/* Insert your iframe or fetched ladder component here */}
            <p className="p-10 text-center text-gray-500 italic font-bold">Ladder Fetching from Football Victoria...</p>
          </div>
        </section>

        {/* GAMES SECTION */}
        <section>
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-red-600 pl-4">Recent & Upcoming Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 border rounded-lg shadow-sm">Next Match: vs Keilor Park (A)</div>
             <div className="p-6 border rounded-lg shadow-sm">Last Match: 2-1 Win vs Banyule City</div>
          </div>
        </section>

        <CoachStaff teamSlug="reserve-men" />
      </div>
    </main>
  );
}