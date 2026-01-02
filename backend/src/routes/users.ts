import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();

router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, surname, email, logo, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAdmin, async (req: any, res: Response) => {
  const targetUserId = req.params.id;
  const adminEmail = req.user.email;
  const adminId = req.user.id;

  if (targetUserId === adminId) {
    return res.status(400).json({ error: "Security Violation: You cannot delete yourself." });
  }

  try {
    const { data: targetUser } = await supabase.from('profiles').select('email, name, surname').eq('id', targetUserId).single();

    const { error: authError } = await supabase.auth.admin.deleteUser(targetUserId);
    if (authError) throw authError;

    // 📝 LOG ACTION
    await supabase.from('audit_logs').insert({
      admin: adminEmail,
      action: 'DELETE_USER',
      target_id: targetUserId,
      details: `Deleted user: ${targetUser?.name} ${targetUser?.surname} (${targetUser?.email})`
    });

    res.json({ message: "User deleted and action logged." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;