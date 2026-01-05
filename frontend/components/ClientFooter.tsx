'use client';
import dynamic from 'next/dynamic';

// We move the dynamic logic here to satisfy Next.js rules
const Footer = dynamic(() => import('./Footer'), { ssr: false });

export default function ClientFooter() {
  return <Footer />;
}