'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id;

  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
  });

  // Fetch existing news
  useEffect(() => {
    async function fetchNews() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${newsId}`);
      const data = await res.json();
      setForm({
        title: data.title,
        summary: data.summary,
        content: data.content,
      });
    }
    fetchNews();
  }, [newsId]);

  // Submit update
  async function handleUpdate() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${newsId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push('/admin/news');
  }

  return (
    <div className="max-w-xl space-y-4">
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        placeholder="Summary"
        value={form.summary}
        onChange={(e) => setForm({ ...form, summary: e.target.value })}
      />
      <textarea
        placeholder="Content"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />

      <div className="flex gap-4">
        <button onClick={() => router.push('/admin/news')}>Cancel</button>
        <Button text="Update" onClick={handleUpdate} />
      </div>
    </div>
  );
}
