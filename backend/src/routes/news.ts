import express from 'express';
import { supabase } from '../supabase';
import { requireAdmin } from '../middleware/requireAdmin';

const router = express.Router();

// Public
router.get('/', async (_, res) => {
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  res.json(data);
});

// Admin
router.post('/', requireAdmin, async (req, res) => {
  const { title, content } = req.body;
  await supabase.from('news').insert({ title, content });
  res.sendStatus(201);
});

export default router;
