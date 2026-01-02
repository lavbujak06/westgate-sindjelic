// app/pages/about/page.tsx
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <Hero heading="Our History" message="A family-oriented club since 1985" showButton={false} />
      
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black uppercase mb-6">More Than Just Football</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Westgate Sindjelic is built on the pillars of **Faith, Family, and Football**. We provide a home for the Serbian community and football lovers across Melbourne.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From our junior programs to our senior squads, we prioritize discipline, culture, and togetherness.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-gray-200 rounded-lg shadow-md custom-img"></div>
            <div className="h-64 bg-red-600 rounded-lg shadow-md flex items-center justify-center p-6 text-white font-bold text-center italic">
              "Fudbal je više od igre."
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}