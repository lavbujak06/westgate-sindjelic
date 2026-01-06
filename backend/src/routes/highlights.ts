import express from 'express';
import { supabase } from '../supabase';
import { requireAdmin } from '../middleware/requireAdmin';

const router = express.Router();

// 🌍 PUBLIC: Fetch published highlights for the slider
router.get('/', async (_, res) => {
  const { data, error } = await supabase
    .from('highlights')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 🔐 ADMIN: Create Highlight
router.post('/', requireAdmin, async (req: any, res) => {
  const { title, youtube_id, published } = req.body;
  const adminEmail = req.user.email;

  const { data, error } = await supabase
    .from('highlights')
    .insert([{ title, youtube_id, published: published || false }])
    .select();

  if (error) return res.status(400).json({ error: error.message });

  await supabase.from('audit_logs').insert({
    admin: adminEmail,
    action: 'CREATE_HIGHLIGHT',
    target_id: data[0].id,
    details: `Added video highlight: "${title}"`
  });

  res.status(201).json(data[0]);
});

// 🔐 ADMIN: Toggle Publish Status or Update
router.put('/:id', requireAdmin, async (req: any, res) => {
  const { title, youtube_id, published } = req.body;
  const adminEmail = req.user.email;

  const { data, error } = await supabase
    .from('highlights')
    .update({ title, youtube_id, published, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select();

  if (error) return res.status(400).json({ error: error.message });

  await supabase.from('audit_logs').insert({
    admin: adminEmail,
    action: 'UPDATE_HIGHLIGHT',
    target_id: req.params.id,
    details: `Updated highlight: "${title}" (Published: ${published})`
  });

  res.json(data[0]);
});

// 🔐 ADMIN: Delete Highlight
router.delete('/:id', requireAdmin, async (req: any, res) => {
  const adminEmail = req.user.email;
  const { error } = await supabase.from('highlights').delete().eq('id', req.params.id);
  
  if (error) return res.status(400).json({ error: error.message });

  await supabase.from('audit_logs').insert({
    admin: adminEmail,
    action: 'DELETE_HIGHLIGHT',
    target_id: req.params.id,
    details: `Deleted video highlight ID: ${req.params.id}`
  });

  res.status(200).json({ message: "Deleted" });
});

export default router;