'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { supabaseClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import { Turnstile } from '@marsidev/react-turnstile';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();
  
  
  // 🛡️ Pull state setters from context to update the Account Menu globally
  const { setUser, setProfile } = useUser();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaToken) {
      setError('Please complete the CAPTCHA');
      return;
    }

    setLoginLoading(true);
    setError('');

    try {
      // 1. BACKEND CHECK
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken }),
        credentials: 'include', 
      });

      // We define 'data' here so it's available for the rest of the 'try' block
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // 2. SUPABASE SYNC (With Dashboard Captcha turned OFF)
      const { error: authError } = await supabaseClient.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (authError) throw authError;

      // 3. SUCCESS - Now 'data' is defined and ready to use!
      setUser(data.user);
      setProfile(data.profile);

      if (data.is_admin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }

    } catch (err: any) { 
      console.error('Login error:', err);
      setError(err.message || 'Connection error'); 
    } finally { 
      setLoginLoading(false); 
    }
  };

  return (
    <main>
      <Navbar />
      <div className="relative min-h-screen w-full flex items-center justify-center custom-img p-4 overflow-hidden">
        {/* Dark overlay for tactical feel */}
        <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md z-10" />
        
        <div className="relative z-20 w-full max-w-[400px] bg-white rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden mt-16 animate-in fade-in zoom-in duration-500">
          <div className="bg-[#0f172a] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">System <span className="text-red-600">Access</span></h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">Sindjelic Secure Portal</p>
          </div>

          <form className="p-10 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Member Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium" 
                placeholder="name@example.com"
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium" 
                placeholder="••••••••"
                required 
              />
            </div>
            <div className="flex justify-center py-2">
              <Turnstile 
                siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY!} 
                onSuccess={(token) => setCaptchaToken(token)} 
                options={{ theme: 'light' }} 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loginLoading}
              className="w-full py-5 bg-red-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 active:scale-95 flex items-center justify-center"
            >
              {loginLoading ? <div className="scale-75"><Loader /></div> : 'Log In'}
            </button>
            
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
                <span>⚠️</span> {error}
              </div>
            )}
            
            <div className="pt-6 text-center border-t border-gray-100 mt-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Need an account? <Link href="/signup" className="text-red-600 hover:text-red-800 transition-colors ml-1">Sign up here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}