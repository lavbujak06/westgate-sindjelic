import './globals.css';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@/context/UserContext';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Westgate Sindjelic',
  description: 'Official Website of Westgate Sindjelic FC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <UserProvider>
          {children}
          <Toaster position="top-right" />
        </UserProvider>
      </body>
    </html>
  );
}