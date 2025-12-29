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
      setError(loginError.message);
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
      router.push('/admin/dashboard');
    } else {
      router.push('/');
    }
  };

  const handleResendConfirmation = async () => {
    try {
      const { error: resendError } = await supabaseClient.auth.resend({
        type: 'signup',
        email,
      });

      if (resendError) {
        alert('Please enter a valid email in the email section in order to resend confirmation email.');
      } else {
        alert('Confirmation email sent! Please check your inbox.');
      }
    } catch (err: any) {
      alert('Unexpected error: ' + err.message);
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

        {/* Always-visible resend confirmation section */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ marginBottom: '0.5rem', color: '#555' }}>
            Haven't authorized your email yet?
          </p>
          <button
            type="button"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#1e40af',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
            onClick={handleResendConfirmation}
          >
            Send confirmation email
          </button>
        </div>
      </div>
    </div>
  );
}
