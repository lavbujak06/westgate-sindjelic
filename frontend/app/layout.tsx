import './globals.css';
import StyledComponentsRegistry from '@/lib/styled-composenet-registery';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@/context/UserContext';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <UserProvider>
            {children}
            <Toaster position="top-right" />
          </UserProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}