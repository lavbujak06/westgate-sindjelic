'use client';

import Link from 'next/link';
import PublishSwitch from './PublishSwitch';
import ConfirmModal from './ConfirmModal';
import { useState } from 'react';

export default function NewsCard({ news }: { news: any }) {
  const [showDelete, setShowDelete] = useState(false);

    const deleteNews = async (id: string) => {
        try {
            const response = await fetch(`/api/news/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setShowDelete(false);
                // Optionally refresh the news list or redirect
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to delete news:', error);
        }
    };
  return (
    <div className="border p-4 rounded flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{news.title}</h3>
        <p className="text-sm text-gray-500">{news.summary}</p>
      </div>

      <div className="flex items-center gap-3">
        <PublishSwitch newsId={news.id} published={news.published} />

        <Link href={`/admin/news/edit/${news.id}`}>
          <button>Edit</button>
        </Link>

        <button onClick={() => setShowDelete(true)}>Delete</button>

        {showDelete && (
          <ConfirmModal
            message="Are you sure you want to delete this news?"
            onCancel={() => setShowDelete(false)}
            onConfirm={() => deleteNews(news.id)}
          />
        )}
      </div>
    </div>
  );
}
