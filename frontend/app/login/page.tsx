'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
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

  // ----------------------------
  // Handle Admin / Backend Login
  // ----------------------------
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // 🔑 ensures HTTP-only cookie is sent
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Login failed');
        setLoginLoading(false);
        return;
      }

      const data = await res.json();

      // 🔹 Refresh frontend state from backend
      await fetchUserProfile();

      // Redirect based on admin
      router.push(data.is_admin ? '/admin/dashboard' : '/');

    } catch (err: any) {
      console.error(err);
      setError('Unexpected error occurred');
    } finally {
      setLoginLoading(false);
    }
  };

  // ----------------------------
  // Resend confirmation email
  // ----------------------------
  const handleResendConfirmation = async () => {
    setResendLoading(true);
    try {
      const { error } = await fetch('https://YOUR_SUPABASE_URL/auth/v1/admin/resend', {
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
            {loginLoading ? <Loader /> : 'Sign In'}
          </button>

          {error && <p className="error">{error}</p>}
        </form>

        {/* Resend confirmation */}
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
            {resendLoading ? <Loader /> : 'Resend Confirmation Email'}
          </button>
        </div>
      </div>
    </div>
  );
}