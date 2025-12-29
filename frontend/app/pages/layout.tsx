import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-container">
      <Header />
      <main className="app-content">
        {children}
        <Toaster position="top-right" />
      </main>
      <Footer />
    </div>
  );
}
