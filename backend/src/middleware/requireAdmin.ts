import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase';

declare global {
  namespace Express {
    interface Request {
      user?: any; // or use a more specific type like User
    }
  }
}

// filepath: requireAdmin.ts
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ error: 'No token' });

  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData?.user) return res.status(401).json({ error: 'Invalid user' });

  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('id', userData.user.id)
    .single();

  if (!admin) return res.status(403).json({ error: 'Not admin' });

  req.user = userData.user;
  next();
}
