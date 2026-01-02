'use client';

import { useState } from 'react';
import Switch from './Switch';

interface PublishSwitchProps {
  newsId: number;
  published: boolean;
}

export default function PublishSwitch({ newsId, published }: PublishSwitchProps) {
  const [isPublished, setIsPublished] = useState(published);

  async function togglePublish() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${newsId}/publish`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!res.ok) {
        console.error('Failed to toggle publish status');
        return;
      }

      // Toggle local state for immediate UI update
      setIsPublished(!isPublished);
    } catch (err) {
      console.error('Error toggling publish:', err);
    }
  }

  return <Switch checked={isPublished} onToggle={togglePublish} />;
}
