'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { supabaseClient } from '@/lib/supabaseClient'; // 👈 Added import
import '../globals.css';
import Loader from '@/components/Loader';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();
  const { fetchUserProfile } = useUser();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);

    try {
      // 🔹 Step 1: Log in with Supabase Client 
      // This fixes the "No session found" error in AdminGuard
      const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoginLoading(false);
        return;
      }

      // 🔹 Step 2: Log in with Backend (Port 5001)
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', 
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Login failed');
        setLoginLoading(false);
        return;
      }

      const data = await res.json();
      await fetchUserProfile();

      // Use window.location.href for admins to ensure the fresh session is detected
      if (data.is_admin) {
        window.location.href = '/admin/dashboard';
      } else {
        router.push('/');
      }

    } catch (err: any) {
      console.error(err);
      setError('Unexpected error occurred');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setResendLoading(true);
    try {
      // Replace with your actual URL or process.env variable
      const { error } = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).then(r => r.json());

      if (error) {
        alert('Please enter a valid email to resend confirmation.');
      } else {
        alert('Confirmation email sent! Please check your inbox.');
      }
    } catch (err: any) {
      alert('Unexpected error: ' + err.message);
    } finally {
      setResendLoading(false);
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
              name="email"
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              name="password"
            />
          </div>
          <button type="submit" className="submit">
            {loginLoading ? <Loader /> : 'Sign In'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ marginBottom: '0.5rem', color: '#555' }}>
            Haven't authorized your email yet?
          </p>
          <button
            type="button"
            className="resend-btn"
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
            {resendLoading ? <Loader /> : 'Resend Confirmation Email'}
          </button>
        </div>
      </div>
    </div>
  );
}