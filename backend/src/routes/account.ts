import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import { accountSchema } from '../schemas/authSchema';

const router = Router();

router.get('/', requireUser, async (req: Request, res: Response) => {
    try{
        
        res.json(req.user);

    } catch (err: any){
        res.status(500).json({ error: err.message });
    }
});

router.put('/', validate(accountSchema), requireUser, async (req: Request, res: Response) => {
    try{
        const userId = req.user!.id;

        const { name, surname, logo} = req.body;

        const { data, error} = await supabase
            .from('profiles')
            .update({
                name,
                surname,
                logo
            })
            .eq('id', userId)
            .select('id, name, surname, email, logo, created_at')
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json(data)
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});


router.delete('/', requireUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const userEmail = req.user!.email;

    // 1. Get user details before deleting for the audit log
    const { data: userData } = await supabase
      .from('profiles')
      .select('name, surname')
      .eq('id', userId)
      .single();

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // 3. 📝 LOG ACTION (Matching your Admin logic)
    await supabase.from('audit_logs').insert({
      admin: userEmail,
      action: 'SELF_DELETE',
      target_id: userId,
      details: `User deleted their own account: ${userData?.name} ${userData?.surname} (${userEmail})`
    });

    res.json({ message: "Account successfully deleted and action logged." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;