import { Router } from 'express';
import { supabase } from '../supabase';
import { requireAdmin } from '../middleware/requireAdmin';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';

// Define the limiter: Max 5 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 7, 
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 signups per hour per IP
  message: { error: 'Too many accounts created from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});


const router = Router();
const SESSION_DURATION = 60 * 60 * 1000;



router.post('/login', loginLimiter, async (req, res) => {
  const { email, password, captchaToken } = req.body; // <-- Get token from frontend

  // 2. Security Check: Verify with Cloudflare
  if (!captchaToken) {
    return res.status(403).json({ error: 'CAPTCHA_REQUIRED' });
  }

  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.CLOUDFLARE_SECRET_KEY}&response=${captchaToken}`,
    });

    const verifyData: any = await verifyRes.json();

    if (!verifyData.success) {
      console.error("Cloudflare Error:", verifyData['error-codes']);
      return res.status(403).json({ error: 'CAPTCHA verification failed' });
    }

    // 3. Only if Cloudflare is happy, talk to Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session || !data.user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ... (Keep the rest of your existing admin check and cookie logic below) ...
    const { data: admin } = await supabase.from('admins').select('id').eq('id', data.user.id).single();
    const isAdmin = !!admin;

    res.cookie('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_DURATION,
    });

    res.cookie('session_issued_at', Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION,
      path: '/',
    });

    return res.json({
      user: { id: data.user.id, email: data.user.email, is_admin: isAdmin },
      is_admin: isAdmin,
    });
  } catch (err) {
    console.error("Login Route Error:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.['sb-access-token'];
    const issuedAt = req.cookies?.session_issued_at;

    // 1. If cookies are missing, don't throw an error, just return nulls
    // This stops the 401 loop on a fresh browser load
    if (!token || !issuedAt) {
      return res.status(200).json({ user: null, profile: null });
    }

    // 2. CHECK 60 MINUTE EXPIRY
    const currentTime = Date.now();
    const sessionStart = parseInt(issuedAt);
    
    if (currentTime - sessionStart > SESSION_DURATION) {
      res.clearCookie('sb-access-token');
      res.clearCookie('session_issued_at');
      return res.status(401).json({ error: 'Session expired' }); // THIS stays 401
    }

    // 3. Normal retrieval logic...
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ user: null, profile: null });

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    const { data: admin } = await supabase.from('admins').select('id').eq('id', user.id).single();

    res.json({
      user: { id: user.id, email: user.email, is_admin: !!admin },
      profile: profile ? { ...profile, is_admin: !!admin } : null,
    });
  } catch (err) {
    res.status(500).json({ user: null, profile: null });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('sb-access-token');
  res.clearCookie('session_issued_at');
  res.sendStatus(200);
});

router.get('/admins', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('admins').select('id, email, created_at');
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Add this new route below your /login route
router.post('/signup', signupLimiter, async (req, res) => {
  const { email, password, captchaToken } = req.body;

  // 1. Verify CAPTCHA (Same logic as login)
  if (!captchaToken) return res.status(400).json({ error: 'Captcha required' });
  
  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.CLOUDFLARE_SECRET_KEY}&response=${captchaToken}`,
  });
  const verifyData: any = await verifyRes.json();
  if (!verifyData.success) return res.status(403).json({ error: 'Invalid Captcha' });

  // 2. Register the user via Supabase
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json({ message: 'Registration successful' });
});

export default router;