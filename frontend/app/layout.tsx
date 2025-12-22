import { Header } from '@/components/Header';
import './globals.css';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Westgate Sindjelic',
  description: 'Website built with Next.js 16',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="app-container">
        <Header />
        <main className="app-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
