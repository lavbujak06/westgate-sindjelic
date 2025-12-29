'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../globals.css';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      // ✅ Call server API that creates user and profile atomically
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      // ✅ Redirect to login after successful signup
      router.push('/login');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="form-wrapper">
        <form className="form" onSubmit={handleSignup}>
          <p className="form-title">Create your account</p>

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
            Sign up
          </button>

          {error && <p className="error">{error}</p>}

          <p className="login-link">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}