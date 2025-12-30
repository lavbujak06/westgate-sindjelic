import { Router } from 'express';
import { supabase } from '../supabase';

const router = Router();
const SESSION_DURATION = 45 * 60 * 1000; // 45 minutes session duration

// ----------------------------
// LOGIN (Full Cookie Setup)
// ----------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session || !data.user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 1. Check if user is an admin
  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('id', data.user.id)
    .single();

  const isAdmin = !!admin;

  // 2. Set the Access Token as an HTTP-only Cookie
  res.cookie('sb-access-token', data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION,
  });

  // 3. Set the Session Timestamp Cookie
  res.cookie('session_issued_at', Date.now().toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION,
  });

  return res.json({
    user: { id: data.user.id, email: data.user.email, is_admin: isAdmin },
    is_admin: isAdmin,
  });
});

// ----------------------------
// WHO AM I? (Cookie-based)
// ----------------------------
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.['sb-access-token'];
    const issuedAt = req.cookies?.session_issued_at;

    if (!token || !issuedAt) {
      return res.status(401).json({ user: null, profile: null });
    }

    // Identify the user using the cookie token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ user: null, profile: null });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('id', user.id)
      .single();

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

export default router;