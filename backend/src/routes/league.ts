import express from 'express';
import { supabase } from '../supabase';

const router = express.Router();

// 1. GET all configs (Seasons)
router.get('/configs', async (req, res) => {
  const { data, error } = await supabase
    .from('league_configs')
    .select('*')
    .order('season_year', { ascending: false });
  
  if (error) return res.status(400).json(error);
  res.json(data);
});

// GET ladder data from your existing table
router.get('/ladder/:configId', async (req, res) => {
  const { configId } = req.params;

  // 1. Get the config details first
  const { data: config } = await supabase.from('league_configs').select('*').eq('id', configId).single();
  
  if (!config) return res.status(404).json({ error: "Config not found" });

  // 2. Query your ladder_cache using season_year and team_name
  const { data, error } = await supabase
    .from('ladder_cache')
    .select('*')
    .eq('season_year', config.season_year)
    .eq('team_name', config.team_name)
    .order('pos', { ascending: true });

  if (error) return res.status(400).json(error);
  res.json(data);
});

// GET games data from your existing table
router.get('/games/:configId', async (req, res) => {
  const { configId } = req.params;

  const { data: config } = await supabase.from('league_configs').select('*').eq('id', configId).single();
  
  if (!config) return res.status(404).json({ error: "Config not found" });

  const { data, error } = await supabase
    .from('games_cache')
    .select('*')
    .eq('season_year', config.season_year)
    .eq('team_name', config.team_name);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// 4. POST new config
router.post('/configs', async (req, res) => {
  const { season_year, team_name, ladder_url, fixtures_url } = req.body;
  const { data, error } = await supabase
    .from('league_configs')
    .insert([{ season_year, team_name, ladder_url, fixtures_url }])
    .select();
  if (error) return res.status(400).json(error);
  res.status(201).json(data[0]);
});

// 5. DELETE a config
router.delete('/configs/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('league_configs')
    .delete()
    .eq('id', id);
  if (error) return res.status(400).json(error);
  res.sendStatus(204);
});

export default router;