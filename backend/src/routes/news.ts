import express from 'express';
import { supabase } from '../supabase';
import { requireAdmin } from '../middleware/requireAdmin';

const router = express.Router();

// 🌍 Public: read-only (No middleware needed here)
router.get('/', async (_, res) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 🔐 Admin: create
router.post('/', requireAdmin, async (req, res) => {
  const { title, content } = req.body;

  const { data, error } = await supabase.from('news').insert({
    title,
    content,
    published: false,
  }).select(); // .select() returns the newly created item

  if (error) return res.status(400).json({ error: error.message });
  
  res.status(201).json(data[0]);
});

// 🔐 Admin: update
router.put('/:id', requireAdmin, async (req, res) => {
  const { title, content, published } = req.body;

  const { error } = await supabase
    .from('news')
    .update({ title, content, published })
    .eq('id', req.params.id);

  if (error) return res.status(400).json({ error: error.message });

  res.sendStatus(204); // 204 means "Success, but no content to send back"
});

// 🔐 Admin: delete
router.delete('/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(400).json({ error: error.message });

  res.sendStatus(204);
});

export default router;