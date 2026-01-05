'use client';
import ClientFooter from '@/components/ClientFooter';

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <ClientFooter />
    </>
  );
}