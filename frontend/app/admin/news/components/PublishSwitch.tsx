'use client';

// import Switch from '@/components/Switch';
import Switch from '../../../../components/Switch'; // adjust path as needed

export default function PublishSwitch({
  newsId,
  published,
}: {
  newsId: number;
  published: boolean;
}) {
  async function togglePublish() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${newsId}/publish`, {
      method: 'PATCH',
    });

    location.reload();
  }

  return (
    <div onClick={togglePublish}>
      <Switch defaultChecked={published} />
    </div>
  );
}
