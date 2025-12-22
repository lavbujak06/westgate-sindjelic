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

    // Targeting the rows specifically
    $('table tr').each((_, row) => {
      // Inside your $('table tr').each loop:
      const cols = $(row).find('td');

      if (cols.length >= 8) {
        const round = $(cols[0]).text().trim();
        const date = $(cols[1]).text().trim();
        const time = $(cols[2]).text().trim();
        const venue = $(cols[3]).text().trim();
        
        // Col 4: First number (Home Score)
        // Col 5: Team Name (Opposition)
        // Col 6: Second number (Away Score)
        const wscore = $(cols[4]).text().trim(); 
        const opponent = $(cols[6]).text().trim();
        const ascore = $(cols[7]).text().trim();

        if (date && round.toLowerCase() !== 'rnd') {
          games.push({ round, date, time, venue, wscore, opponent, ascore });
        }
      }
    });

    console.log(`Successfully scraped ${games.length} games.`);
    console.log(`Successfully scraped ${games[0].round} round.`);
    console.log(`Successfully scraped ${games[1].date} date.`);
    console.log(`Successfully scraped ${games[2].time} time.`);
    console.log(`Successfully scraped ${games[3].venue} venue.`);
    console.log(`Successfully scraped ${games[4].wscore} wscore.`);
    console.log(`Successfully scraped ${games[5].opponent} opponent.`);
    console.log(`Successfully scraped ${games[6].ascore} ascore.`);
    res.json(games);
  } catch (err) {
    console.error("Scraping Error:", err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

export default router;