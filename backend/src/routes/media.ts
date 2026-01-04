import express from 'express';
import multer from 'multer';
import { supabase } from '../supabase';

const router = express.Router();

// Configure Multer to store files in memory temporarily
const upload = multer({ storage: multer.memoryStorage() });

// 1. UPLOAD IMAGE
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const { team_slug } = req.body;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    // Create a unique filename (e.g., 1704381234-action.jpg)
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${team_slug}/${fileName}`;

    // A. Upload to Supabase Storage Bucket
    const { data: storageData, error: storageError } = await supabase.storage
      .from('team_media')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (storageError) throw storageError;

    // B. Get the Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('team_media')
      .getPublicUrl(filePath);

    // C. Save metadata to Database
    const { data: dbData, error: dbError } = await supabase
      .from('team_media')
      .insert([
        { 
          url: publicUrl, 
          file_path: filePath, 
          team_slug: team_slug 
        }
      ])
      .select();

    if (dbError) throw dbError;

    res.status(201).json(dbData[0]);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 2. GET IMAGES BY TEAM
router.get('/:teamSlug', async (req, res) => {
  const { data, error } = await supabase
    .from('team_media')
    .select('*')
    .eq('team_slug', req.params.teamSlug)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json(error);
  res.json(data);
});

// 3. DELETE IMAGE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // A. Get the file path first so we can delete from storage
    const { data: media } = await supabase
      .from('team_media')
      .select('file_path')
      .eq('id', id)
      .single();

    if (!media) return res.status(404).json({ error: 'Media not found' });

    // B. Delete from Storage
    const { error: storageError } = await supabase.storage
      .from('team_media')
      .remove([media.file_path]);

    if (storageError) throw storageError;

    // C. Delete from Database
    const { error: dbError } = await supabase
      .from('team_media')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    res.sendStatus(204);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;