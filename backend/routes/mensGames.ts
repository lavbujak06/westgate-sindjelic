import express, { Request, Response } from 'express';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(
      'https://websites.mygameday.app/team_info.cgi?c=0-8746-124172-645818-16773739&a=SFIX'
    );

    const html = await response.text();
    const $ = cheerio.load(html);
    const games: any[] = [];

    // Look for every row in the table
    $('table tr').each((_, row) => {
      const cols = $(row).find('td, th');

      // We lower the requirement to 5 columns so we don't miss anything
      if (cols.length >= 5) {
        const round = $(cols[0]).text().trim();
        const date = $(cols[1]).text().trim();
        const time = $(cols[2]).text().trim();
        const venue = $(cols[3]).text().trim();
        
        // Use .find('a') to get team names because GameDay links teams.
        // This helps us avoid 'View' buttons which are also links.
        const teamLinks = $(row).find('a').filter((i, el) => {
           return $(el).text().trim().toLowerCase() !== 'view';
        });

        const homeTeam = $(teamLinks[0]).text().trim();
        const awayTeam = $(teamLinks[1]).text().trim();

        // Scores are often in columns 5 and 7
        const wscore = $(cols[5]).text().trim() || '0';
        const ascore = $(cols[7]).text().trim() || '0';

        // Validation: Must have a date and at least one team name
        if (date && (homeTeam || awayTeam) && round.toLowerCase() !== 'rnd') {
          games.push({
            round,
            date,
            time,
            venue,
            wscore,
            ascore,
            // Logic: if Westgate is the Home team, the opponent is the Away team
            opponent: homeTeam.includes('Westgate') ? awayTeam : homeTeam
          });
        }
      }
    });

    console.log(`Successfully scraped ${games.length} games.`);
    res.json(games);
  } catch (err) {
    console.error("Scraping Error:", err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

export default router;