import express from 'express';
import { supabase } from '../supabase';
import { requireAdmin } from '../middleware/requireAdmin';
import { scrapeLadderData, scrapeGamesData } from '../services/scraperService';

const router = express.Router();

/**
 * POST /api/scraper/sync/:configId
 * Admin only: Triggers a fresh scrape from GameDay and updates the local cache.
 */
router.post('/sync/:configId', requireAdmin, async (req: any, res) => {
  const { configId } = req.params;

  try {
    console.log(`[Sync] Starting sync for Config ID: ${configId}`);

    // 1. Fetch the URL Configuration from Supabase
    const { data: config, error: configError } = await supabase
      .from('league_configs')
      .select('*')
      .eq('id', configId)
      .single();

    if (configError || !config) {
      console.error("[Sync] Config Error:", configError);
      return res.status(404).json({ error: "Configuration not found in database." });
    }

    // 2. Perform the Scrape using the Service
    console.log(`[Sync] Scraping Ladder: ${config.ladder_url}`);
    const ladderResults = await scrapeLadderData(config.ladder_url);
    
    console.log(`[Sync] Scraping Games: ${config.fixtures_url}`);
    const gamesResults = await scrapeGamesData(config.fixtures_url);

    // 3. Process and Update Ladder Cache
    // We delete old entries for this specific team/year to keep the cache clean
    await supabase.from('ladder_cache')
      .delete()
      .eq('season_year', config.season_year)
      .eq('team_name', config.team_name);
      
    const ladderToSave = ladderResults.map((item: any) => ({
      ...item,
      season_year: config.season_year,
      team_name: config.team_name,
      pos: parseInt(item.pos) || 0 // Ensure position is a number
    }));

    const { error: ladderInsertError } = await supabase.from('ladder_cache').insert(ladderToSave);
    if (ladderInsertError) throw ladderInsertError;

    // 4. Process and Update Games Cache
    await supabase.from('games_cache')
      .delete()
      .eq('season_year', config.season_year)
      .eq('team_name', config.team_name);

    const gamesToSave = gamesResults.map((item: any) => ({
      round: item.round,
      date_text: item.date,
      time_text: item.time,
      venue: item.venue,
      w_score: item.wscore,
      opponent: item.opponent,
      a_score: item.ascore,
      season_year: config.season_year,
      team_name: config.team_name
    }));

    const { error: gamesInsertError } = await supabase.from('games_cache').insert(gamesToSave);
    if (gamesInsertError) throw gamesInsertError;

    console.log(`[Sync] Success: Updated ${config.team_name} for ${config.season_year}`);
    
    res.json({ 
      message: `Successfully synced ${config.team_name}`,
      ladderCount: ladderToSave.length,
      gamesCount: gamesToSave.length
    });

  } catch (err: any) {
    console.error("[Sync] Fatal Error:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error during sync" });
  }
});

export default router;