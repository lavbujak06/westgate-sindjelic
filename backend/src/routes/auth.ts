import { Router } from 'express';
import { supabase } from '../supabase';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();
const SESSION_DURATION = 60 * 60 * 1000;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session || !data.user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const { data: admin } = await supabase.from('admins').select('id').eq('id', data.user.id).single();
  const isAdmin = !!admin;

  if (isAdmin) {
    await supabase.from('audit_logs').insert({
      admin: data.user.email,
      action: 'ADMIN_LOGIN',
      details: 'Admin logged into the system'
    });
  }

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

export default router;