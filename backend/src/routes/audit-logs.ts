import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();

// 🛡️ GET ALL LOGS
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 🛡️ CLEAR ALL LOGS
router.delete('/clear', requireAdmin, async (req: any, res: Response) => {
  try {
    const adminEmail = req.user.email;

    // 1. Delete all logs
    const { error: deleteError } = await supabase
      .from('audit_logs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); 

    if (deleteError) throw deleteError;

    // 2. Log the "Clear" action so there is still a record of who did it
    await supabase.from('audit_logs').insert({
      admin: adminEmail,
      action: 'CLEAR_LOGS',
      details: 'Administrator cleared the entire audit history'
    });

    res.json({ message: "Logs cleared successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;