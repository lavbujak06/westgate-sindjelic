import express from 'express';
import multer from 'multer';
import { supabase } from '../supabase'; // Ensure this uses your SERVICE_ROLE_KEY
import { requireAdmin } from '../middleware/requireAdmin';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🌍 PUBLIC: Fetch coaches
router.get('/', async (req, res) => {
  const { team } = req.query;
  let query = supabase
    .from('coaches')
    .select('*')
    .order('display_order', { ascending: true });

  if (team) query = query.eq('team_slug', team);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 🛡️ ADMIN: Create a new coach (Handles Image + Data)
router.post('/', requireAdmin, upload.single('image'), async (req: any, res) => {
  try {
    const { name, role, team_slug, display_order } = req.body;
    const adminEmail = req.user.email;
    let finalImageUrl = req.body.image_url || '';

    // 1. If a file is uploaded, send it to Supabase Storage
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname.replace(/\s/g, '_')}`;
      const filePath = `staff/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('coach-photos')
        .upload(filePath, req.file.buffer, { contentType: req.file.mimetype });

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage.from('coach-photos').getPublicUrl(filePath);
      finalImageUrl = publicUrl;
    }

    // 2. Insert into Database (Bypasses RLS via Service Key)
    const { data, error: dbError } = await supabase
      .from('coaches')
      .insert([{ 
        name, 
        role, 
        team_slug, 
        image_url: finalImageUrl, 
        display_order: parseInt(display_order) || 1 
      }])
      .select();

    if (dbError) throw dbError;

    // 3. Log Action
    await supabase.from('audit_logs').insert({
      admin: adminEmail,
      action: 'CREATE_COACH',
      target_id: data[0].id,
      details: `Created coach: "${name}"`
    });

    res.status(201).json(data[0]);
  } catch (err: any) {
    console.error("Upload Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🛡️ ADMIN: Update a coach
router.put('/:id', requireAdmin, upload.single('image'), async (req: any, res) => {
  try {
    const { name, role, team_slug, display_order, image_url } = req.body;
    const adminEmail = req.user.email;
    let finalImageUrl = image_url;

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = `staff/${fileName}`;
      await supabase.storage.from('coach-photos').upload(filePath, req.file.buffer);
      const { data: { publicUrl } } = supabase.storage.from('coach-photos').getPublicUrl(filePath);
      finalImageUrl = publicUrl;
    }

    const { data, error } = await supabase
      .from('coaches')
      .update({ name, role, team_slug, image_url: finalImageUrl, display_order: parseInt(display_order) })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;

    await supabase.from('audit_logs').insert({
      admin: adminEmail,
      action: 'UPDATE_COACH',
      target_id: data[0].id,
      details: `Updated coach: "${name}"`
    });

    res.json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 🛡️ ADMIN: Delete a coach
router.delete('/:id', requireAdmin, async (req: any, res) => {
    const adminEmail = req.user.email;
    const { data: coachData } = await supabase.from('coaches').select('name').eq('id', req.params.id).single();
    const { error } = await supabase.from('coaches').delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });

    await supabase.from('audit_logs').insert({
      admin: adminEmail,
      action: 'DELETE_COACH',
      target_id: req.params.id,
      details: `Deleted coach: "${coachData?.name}"`
    });
    res.status(204).send();
});

export default router;