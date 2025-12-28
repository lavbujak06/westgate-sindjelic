import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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
      </main>
      <Footer />
    </div>
  );
}
