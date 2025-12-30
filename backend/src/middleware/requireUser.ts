import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function requireUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1️⃣ Extract token from headers
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    // 2️⃣ Get user from Supabase Auth
    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData?.user) return res.status(401).json({ error: 'Invalid user' });

    // 3️⃣ Check profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (!profile) return res.status(403).json({ error: 'Not a registered user' });

    // 4️⃣ Attach user info
    req.user = userData.user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}