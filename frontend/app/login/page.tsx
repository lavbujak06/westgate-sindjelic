'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // ✅ import js-cookie

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1️⃣ Sign in with Supabase
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Login data:', data);
    console.log('Login error:', loginError);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    if (!data.user) {
      setError('No user found');
      return;
    }

    const userId = data.user.id;

    // 2️⃣ Check admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', userId)
      .single();

    if (adminError || !adminData) {
      setError('You are not an admin.');
      return;
    }

    // ✅ Set cookie for frontend middleware
    if (data.session?.access_token) {
      Cookies.set('sb-access-token', data.session.access_token, {
        path: '/',         // cookie accessible on all routes
        sameSite: 'lax',   // recommended
        expires: 1,        // expires in 1 day
      });
    }

    // 3️⃣ Redirect to admin dashboard
    router.push('/admin/dashboard');
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
