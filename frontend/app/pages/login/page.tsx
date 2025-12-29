'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { supabaseClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const { data, error: loginError } =
      await supabaseClient.auth.signInWithPassword({
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

    // Check admins table
    const { data: adminData, error: adminError } = await supabaseClient
      .from('admins')
      .select('id')
      .eq('id', userId)
      .single();

    if (adminError || !adminData) {
      setError('You are not an admin.');
      return;
    }

    // Set cookie for middleware
    if (data.session?.access_token) {
      Cookies.set('sb-access-token', data.session.access_token, {
        path: '/',
        sameSite: 'lax',
        expires: 1,
      });
    }

    router.push('/admin/dashboard');
  };

  return (
    <PageWrapper>
      <FormWrapper>
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

          <p className="signup-link">
            No account? <a href="/pages/signup">Sign up</a>
          </p>
        </form>
      </FormWrapper>
    </PageWrapper>
  );
}

/* ---------------- styles ---------------- */

const PageWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f9fafb;
`;

const FormWrapper = styled.div`
  .form {
    background-color: #ffffff;
    padding: 2.5rem 2rem; /* ⬅️ more breathing room */
    width: 100%;
    max-width: 360px;
    border-radius: 1rem; /* ⬅️ rounder form */
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .form-title {
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 1.75rem;
  }

  .input-container {
    margin-bottom: 1.25rem;
  }

  .input-container input {
    width: 100%;
    padding: 0.85rem 1rem; /* ⬅️ keeps text away from edges */
    font-size: 0.875rem;
    border-radius: 0.75rem; /* ⬅️ rounder inputs */
    border: 1px solid #e5e7eb;
    outline: none;
    box-sizing: border-box;
  }

  .input-container input:focus {
    border-color: #4f46e5;
  }

  .submit {
    width: 100%;
    padding: 0.85rem;
    margin-top: 0.5rem;
    background-color: #4f46e5;
    color: white;
    border-radius: 0.75rem; /* ⬅️ matches inputs */
    font-weight: 500;
    cursor: pointer;
  }

  .error {
    color: #dc2626;
    font-size: 0.875rem;
    margin-top: 0.75rem;
    text-align: center;
  }

  .signup-link {
    margin-top: 1.25rem;
    font-size: 0.875rem;
    text-align: center;
    color: #6b7280;
  }

  .signup-link a {
    text-decoration: underline;
  }
`;