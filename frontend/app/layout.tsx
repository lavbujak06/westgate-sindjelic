// frontend/app/layout.tsx
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
