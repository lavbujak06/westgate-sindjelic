import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase';
import { UserProfile } from '../types/User';

declare global {
  namespace Express {
    interface Request {
      user?: UserProfile;
    }
  }
}

export async function requireUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: userData, error: authError } =
      await supabase.auth.getUser(token);

    if (authError || !userData?.user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, surname, email, logo, created_at')
      .eq('id', userData.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({ error: 'Not a registered user' });
    }

    req.user = profile;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
