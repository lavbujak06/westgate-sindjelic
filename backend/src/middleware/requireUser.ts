// filepath: requireUser.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function requireUser(req: Request, res: Response, next: NextFunction) {
  // 1️⃣ Extract token from headers
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  // 2️⃣ Get user from Supabase
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) return res.status(401).json({ error: 'Invalid user' });

  // 3️⃣ Check profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user.id)
    .single();

  if (profileError || !profile) return res.status(403).json({ error: 'Not a registered user' });

  // 4️⃣ Attach user to request and continue
  req.user = userData.user;
  next();
}