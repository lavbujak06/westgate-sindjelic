'use client';

import Link from 'next/link';
import Button from '../../../../components/Button'; // adjust path as needed

export default function CreateButton() {
  return (
    <Link href="/admin/news/new">
      <Button text="Create" />
    </Link>
  );
}
