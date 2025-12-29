import StyledComponentsRegistry from '@/lib/styled-composenet-registery';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@/context/UserContext'; // make sure path is correct

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
      <body>
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
