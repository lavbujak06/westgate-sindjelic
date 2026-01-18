'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // 1. Get Session instead of User (faster for frontend)
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (!session) {
          console.log("AdminGuard: No session found, redirecting...");
          router.replace('/login');
          return;
        }

        console.log("AdminGuard: 🔍 Found user:", session.user.email);

        // 2. Query the admins table
        const { data, error } = await supabaseClient
          .from('admins')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle(); // Use maybeSingle to prevent error if not found

        if (error) {
          console.error("AdminGuard: DB Error:", error.message);
          router.replace('/login');
          return;
        }

        if (!data) {
          console.log("AdminGuard: User is logged in but NOT in admins table.");
          router.replace('/login');
          return;
        }

        console.log("AdminGuard: Admin confirmed!");
        setAuthorized(true);
      } catch (err) {
        console.error("AdminGuard: Crash:", err);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) return <div style={{ padding: '2rem' }}>Verifying Admin Identity...</div>;

  return authorized ? <>{children}</> : null;
}