'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        // Not logged in → go to login
        router.push('/login');
        return;
      }

      // Optionally check admins table
      const { data: adminData, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !adminData) {
        router.push('/login');
        return;
      }

      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <h1>Admin Dashboard</h1>;
}
