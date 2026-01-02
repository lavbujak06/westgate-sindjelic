import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase';

// This interface ensures TypeScript doesn't complain about req.user
interface AuthenticatedRequest extends Request {
  user?: any; 
}

export async function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.['sb-access-token'];

    if (!token) {
      return res.status(401).json({ error: 'Session missing' });
    }

    const { data: userData, error } = await supabase.auth.getUser(token);
    if (error || !userData?.user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Checking the 'admins' table like your original working version
    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (!admin) {
      return res.status(403).json({ error: 'Admins only' });
    }

    // Attach user to request so Audit Logs can see WHO did the action
    req.user = userData.user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
}