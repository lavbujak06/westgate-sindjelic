'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar'; 
import { Turnstile } from '@marsidev/react-turnstile';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [signupLoading, setSignupLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  // Handle clearing errors when typing
  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setError('');

    if (!captchaToken) {
      setError("Please complete the CAPTCHA");
      return;
    }
    setSignupLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error || data.message || 'Signup failed';
        
        // Map backend Zod strings to the specific state fields
        if (msg.toLowerCase().includes("email")) setErrors({ email: msg });
        else if (msg.toLowerCase().includes("password")) setErrors({ password: msg });
        else if (msg.toLowerCase().includes("captcha")) setErrors({ captcha: msg });
        else setError(msg); // Use global alert for anything else
        return;
      }

      toast.success("Success! Check your email for confirmation.");
      router.push('/login');
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <main>
      <Navbar /> {/* Navigation included */}
      <div className="relative min-h-screen w-full flex items-center justify-center custom-img p-4 overflow-hidden">
        <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-xl z-10" />
        
        <div className="relative z-20 w-full max-w-[400px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden mt-16">
          <div className="bg-[#1e293b] p-8 text-center border-b border-gray-100">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white">Create Account</h2>
            <div className="h-1 w-12 bg-red-600 mx-auto mt-2" />
            <p className="text-gray-400 text-[10px] mt-3 uppercase font-bold tracking-tighter">Join the Sindjelic Family</p>
          </div>

          <form className="p-8 space-y-5" onSubmit={handleSignup}>

            {/* EMAIL FIELD */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                {errors.email && (
                  <span className="text-[9px] font-bold text-red-600 uppercase italic animate-pulse">
                    {errors.email}
                  </span>
                )}
              </div>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => handleInputChange('email', e.target.value)} 
                placeholder="name@example.com"
                className={`w-full px-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-600' : 'border-gray-200'} rounded-xl text-gray-900 focus:ring-2 focus:ring-red-600 outline-none transition placeholder:text-gray-300`} 
                required 
              />
            </div>
            
            {/* PASSWORD FIELD */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Password</label>
                {errors.password && (
                  <span className="text-[9px] font-bold text-red-600 uppercase italic animate-pulse">
                    {errors.password}
                  </span>
                )}
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => handleInputChange('password', e.target.value)} 
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-gray-50 border ${errors.password ? 'border-red-600' : 'border-gray-200'} rounded-xl text-gray-900 focus:ring-2 focus:ring-red-600 outline-none transition placeholder:text-gray-300`} 
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
              className="w-full flex justify-center items-center h-[52px] bg-red-700 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-red-800 transition-all shadow-lg active:scale-95 disabled:opacity-70"
              disabled={signupLoading}
            >
              {signupLoading ? <Loader /> : 'Sign Up'}
            </button>
            
            {error && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <p className="text-red-600 text-center text-xs font-bold">{error}</p>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-50 text-center">
              <p className="text-xs text-gray-500">
                Already a member? <Link href="/login" className="text-red-700 font-bold hover:underline ml-1">Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}