'use client';

import Link from 'next/link';
import CreateButton from './CreateButton'; // import your styled button

export default function NewsCreateLink() {
  return (
    <Link href="/admin/news/new">
      <CreateButton />
    </Link>
  );
}
