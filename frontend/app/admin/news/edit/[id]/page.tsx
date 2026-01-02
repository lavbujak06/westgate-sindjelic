'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreateButton from '@/components/CreateButton';

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id;

  const [form, setForm] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    async function fetchNews() {
      // Use the public GET route we just made in the backend
      const res = await fetch(`http://localhost:5001/api/news/${newsId}`);
      const data = await res.json();
      setForm({
        title: data.title,
        content: data.content,
      });
    }
    fetchNews();
  }, [newsId]);

  async function handleUpdate() {
    const res = await fetch(`http://localhost:5001/api/news/${newsId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include', // 👈 Crucial for requireAdmin
    });

    if (res.ok) {
      router.push('/admin/news');
    } else {
      alert("Failed to update news");
    }
  }

  return (
    <div className="max-w-xl space-y-4 p-8">
      <h1 className="text-2xl font-bold">Edit News</h1>
      <input
        className="w-full border p-2 rounded"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="w-full border p-2 rounded h-40"
        placeholder="Content"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />

      <div className="flex gap-4">
        <button 
          className="px-4 py-2 bg-gray-300 rounded" 
          onClick={() => router.push('/admin/news')}
        >
          Cancel
        </button>
        {/* Fixed: children instead of text prop */}
        <CreateButton onClick={handleUpdate}>Update News</CreateButton>
      </div>
    </div>
  );
}