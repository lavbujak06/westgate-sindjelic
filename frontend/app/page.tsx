import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import  Navbar  from '@/components/Navbar';

export default function HomePage() {
  return (
    <main>
      {/* The Navbar sits on top because it has 'fixed' styling */}
      <Navbar />

      {/* The Hero is the first thing users see */}
      <Hero 
        heading='Westgate Sindjelic' 
        message='Faith. Family. Football.' 
      />

      {/* This is where you add your "other divs" later. 
          Use a container to keep them centered like the video.
      */}
      <div className='mmax-w-310 m-auto p-4 py-16'>
        <h2 className='text-3xl font-bold text-center mb-8'>Upcoming Matches</h2>
        <p className='text-center text-gray-600'>
          This is where your custom content related to your website goes.
        </p>
      </div>

      <Footer />
    </main>
  );
}