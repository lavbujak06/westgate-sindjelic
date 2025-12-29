import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import StyledComponentsRegistry from '@/lib/styled-composenet-registery';
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
        <StyledComponentsRegistry>
          {children}
          <Toaster position="top-right" />
        </StyledComponentsRegistry>
      </main>
      <Footer />
    </div>
  );
}
