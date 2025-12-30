import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase';

// 1. We define a new "version" of the Request that includes 'user'
interface AuthenticatedRequest extends Request {
  user?: any; 
}

// 2. We tell this function to use our 'AuthenticatedRequest' instead of the standard 'Request'
export async function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.['sb-access-token'];

    if (!token) {
      return res.status(401).json({ error: 'Session missing' });
    }

    const { data: userData, error } = await supabase.auth.getUser(token);
    if (error || !userData?.user) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (!admin) return res.status(403).json({ error: 'Access denied: Admins only' });

    // Now TypeScript is happy because 'user' exists on 'AuthenticatedRequest'
    req.user = userData.user;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error during authorization' });
  }
}