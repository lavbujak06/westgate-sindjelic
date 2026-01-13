'use client';
import { useState } from 'react';
import Switch from './Switch';
import toast from 'react-hot-toast';

interface PublishSwitchProps {
  newsId: string;
  published: boolean;
  onChange: (value: boolean) => void;
}

export default function PublishSwitch({
  newsId,
  published,
  onChange,
}: PublishSwitchProps) {
  const [isPublished, setIsPublished] = useState(published);
  const [loading, setLoading] = useState(false);

  async function togglePublish() {
    const nextValue = !isPublished;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/news/${newsId}/publish`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ published: nextValue }),
        }
      );

      if (!res.ok) throw new Error();

      setIsPublished(nextValue);
      onChange(nextValue);

      toast.success(nextValue ? 'Article published' : 'Moved to drafts');
    } catch {
      toast.error('Failed to update publish state');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Switch
      checked={isPublished}
      onToggle={togglePublish}
      disabled={loading}
    />
  );
}
