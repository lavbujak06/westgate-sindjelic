import express from 'express';
import { supabase } from '../supabase';
import { requireAdmin } from '../middleware/requireAdmin';

const router = express.Router();

// 🌍 PUBLIC: Fetch all (No changes)
router.get('/', async (_, res) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 🌍 PUBLIC: Fetch single (No changes)
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: "News not found" });
  res.json(data);
});

// 🔐 ADMIN: Create
router.post('/', requireAdmin, async (req: any, res) => {
  // Add image_url to the destructuring
  const { title, content, published, image_url } = req.body;
  const adminEmail = req.user.email;

  const { data, error } = await supabase
    .from('news')
    // Include image_url in the insert object
    .insert([{ title, content, image_url, published: published || false }])
    .select();

  if (error) return res.status(400).json({ error: error.message });

  await supabase.from('audit_logs').insert({
    admin: adminEmail,
    action: 'CREATE_NEWS',
    target_id: data[0].id,
    details: `Created news article: "${title}"`
  });

  res.status(201).json(data[0]);
});

// 🔐 ADMIN: Update
router.put('/:id', requireAdmin, async (req: any, res) => {
  const { title, content, published, image_url } = req.body;
  const adminEmail = req.user.email;

  const { data, error } = await supabase
    .from('news')
    .update({ 
      title, 
      content, 
      published, 
      image_url, // Update the image
      updated_at: new Date().toISOString() 
    })
    .eq('id', req.params.id)
    .select();

  if (error) return res.status(400).json({ error: error.message });

  // 📝 LOG ACTION
  await supabase.from('audit_logs').insert({
    admin: adminEmail,
    action: 'UPDATE_NEWS',
    target_id: req.params.id,
    details: `Updated news article: "${title}" (Published: ${published})`
  });

  res.json(data[0]);
});

// 🔐 ADMIN: Delete
router.delete('/:id', requireAdmin, async (req: any, res) => {
  const adminEmail = req.user.email;

  // Fetch title before deleting for a better log message
  const { data: oldNews } = await supabase.from('news').select('title').eq('id', req.params.id).single();

  const { error } = await supabase.from('news').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });

  // 📝 LOG ACTION
  await supabase.from('audit_logs').insert({
    admin: adminEmail,
    action: 'DELETE_NEWS',
    target_id: req.params.id,
    details: `Deleted news article: "${oldNews?.title || 'Unknown'}"`
  });

  res.status(200).json({ message: "Deleted" });
});

export default router;