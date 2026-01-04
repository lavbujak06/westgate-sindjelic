import express from 'express';
import { supabase } from '../supabase';
import { requireAdmin } from '../middleware/requireAdmin';

const router = express.Router();

// 🌍 PUBLIC: Fetch coaches with team filtering
router.get('/', async (req, res) => {
  const { team } = req.query; // e.g., ?team=senior-men

  let query = supabase
    .from('coaches')
    .select('*')
    .order('display_order', { ascending: true });

  // If a team is specified, filter by it
  if (team) {
    query = query.eq('team_slug', team);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin: Create a new coach
router.post('/', requireAdmin, async (req: any, res) => {
    const { name, role, team_slug, image_url, display_order } = req.body;
    const adminEmail = req.user.email;

    const { data, error } = await supabase
      .from('coaches')
      .insert([{ 
        name, 
        role, 
        team_slug, 
        image_url, 
        display_order: display_order || 1
     }])
     .eq('id', req.params.id)
     .select();

    if (error) return res.status(400).json({ error: error.message });

    // 📝 LOG ACTION
    await supabase.from('audit_logs').insert({
      admin: adminEmail,
      action: 'CREATE_COACH',
      target_id: data[0].id,
      details: `Created coach: "${name}"`
    });

    res.status(201).json(data[0]);
  });

// Admin: Update a coach
router.put('/:id', requireAdmin, async (req: any, res) => {
    const { name, role, team_slug, image_url, display_order } = req.body;
    const adminEmail = req.user.email;

    try {
        const { data, error } = await supabase
          .from('coaches')
          .update({ 
            name, 
            role, 
            team_slug, 
            image_url, 
            display_order: Number(display_order), 
          })
          .eq('id', req.params.id)
          .select();

        if (error) {
            console.error("Supabase Update Error:", error);
            return res.status(400).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Coach not found or no changes made" });
        }

        // 📝 LOG ACTION - Now safe because we verified data[0] exists
        await supabase.from('audit_logs').insert({
          admin: adminEmail,
          action: 'UPDATE_COACH',
          target_id: data[0].id,
          details: `Updated coach: "${name}"`
        });

        res.json(data[0]);
    } catch (err: any) {
        console.error("Server Crash Avoided:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Admin: Delete a coach
router.delete('/:id', requireAdmin, async (req: any, res) => {
    const adminEmail = req.user.email;

    // Fetch the coach to get the name for logging
    const { data: coachData, error: fetchError } = await supabase
      .from('coaches')
      .select('name')
      .eq('id', req.params.id)
      .single();

    if (fetchError) return res.status(404).json({ error: "Coach not found" });

    const { error } = await supabase
      .from('coaches')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(400).json({ error: error.message });

    // 📝 LOG ACTION
    await supabase.from('audit_logs').insert({
      admin: adminEmail,
      action: 'DELETE_COACH',
      target_id: req.params.id,
      details: `Deleted coach: "${coachData.name}"`
    });

    res.status(204).send();
  });

export default router;