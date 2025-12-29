'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import '../globals.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const { data, error: loginError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      if (loginError.message.includes('Email not confirmed')) {
        setError('Email not confirmed. Please check your inbox.');
      } else {
        setError(loginError.message);
      }
      return;
    }

    if (!data.user) {
      setError('No user found');
      return;
    }

    const userId = data.user.id;

    // Check if admin
    const { data: adminData } = await supabaseClient
      .from('admins')
      .select('id')
      .eq('id', userId)
      .single();

    // Set cookie for middleware
    if (data.session?.access_token) {
      Cookies.set('sb-access-token', data.session.access_token, {
        path: '/',
        sameSite: 'lax',
        expires: 1,
      });
    }

    if (adminData) {
      // Admins go to dashboard
      router.push('/admin/dashboard');
    } else {
      // Normal users go to homepage
      router.push('/');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="form-wrapper">
        <form className="form" onSubmit={handleLogin}>
          <p className="form-title">Sign in to your account</p>

          <div className="input-container">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit">
            Sign in
          </button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
