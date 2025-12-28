'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import CreateButton from '../components/CreateButton';

export default function NewNewsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabaseClient
      .from('news')
      .insert([{ title, content, published }])
      .select(); // <- returns inserted row(s)

    setLoading(false);

    if (error) {
      console.error('Supabase insert error:', error);
      alert('Failed to create news: ' + error.message);
      return;
    }

    console.log('Inserted news:', data);
    // Clear form or redirect
    setTitle('');
    setContent('');
    setPublished(false);
    alert('News created successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="border p-2 w-full"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
        className="border p-2 w-full h-40"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Published
      </label>

      <CreateButton type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </CreateButton>
    </form>
  );
}
