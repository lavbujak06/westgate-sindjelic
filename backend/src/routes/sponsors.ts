import express from 'express';
import { supabase } from '../supabase';
import { requireAdmin } from '../middleware/requireAdmin';

const router = express.Router();

// 🌍 PUBLIC: Fetch all sponsors
router.get('/', async (_, res) => {
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .order('name', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 🔐 ADMIN: Create a new sponsor
router.post('/', requireAdmin, async (req: any, res) => {
  const { name, image_url, website_url } = req.body;
  const adminEmail = req.user.email;

  const { data, error } = await supabase
    .from('sponsors')
    .insert([{ name, image_url, website_url }])
    .select();

  if (error) return res.status(400).json({ error: error.message });

  // 📝 LOG ACTION
  console.log(`Admin ${adminEmail} created sponsor: ${name}`);
    res.status(201).json(data[0]);
});

// 🔐 ADMIN: Delete a sponsor
router.delete('/:id', requireAdmin, async (req: any, res) => {
  const { id } = req.params;
  const adminEmail = req.user.email;

  const { data, error } = await supabase
    .from('sponsors')
    .delete()
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error: error.message });

  // 📝 LOG ACTION
  console.log(`Admin ${adminEmail} deleted sponsor with ID: ${id}`);
  res.status(204).send();
});

export default router;