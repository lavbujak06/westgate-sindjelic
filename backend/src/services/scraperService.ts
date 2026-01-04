import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

/**
 * Scrapes a standard MyGameDay ladder table
 * @param url The MyGameDay Ladder URL
 */
export const scrapeLadderData = async (url: string) => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const ladder: any[] = [];

    // Select all rows in the first table found
    $('table tr').each((_, row) => {
      const cols = $(row).find('td');

      // MyGameDay ladders typically have 10 columns for full stats
      if (cols.length === 10) {
        ladder.push({
          pos: $(cols[0]).text().trim(),
          team: $(cols[1]).text().trim(),
          p: $(cols[2]).text().trim(),
          w: $(cols[3]).text().trim(),
          d: $(cols[4]).text().trim(),
          l: $(cols[5]).text().trim(),
          f: $(cols[6]).text().trim(),
          a: $(cols[7]).text().trim(),
          gd: $(cols[8]).text().trim(),
          pts: $(cols[9]).text().trim(),
        });
      }
    });

    return ladder;
  } catch (err) {
    console.error("Scraper Service Error (Ladder):", err);
    throw new Error("Failed to parse ladder data from source.");
  }
};

/**
 * Scrapes a MyGameDay team fixtures/results table
 * @param url The MyGameDay Team Fixtures URL
 */
export const scrapeGamesData = async (url: string) => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const games: any[] = [];

    $('table tr').each((_, row) => {
      const cols = $(row).find('td');

      // Typical MyGameDay fixture table has 8+ columns
      if (cols.length >= 8) {
        const round = $(cols[0]).text().trim();
        const date = $(cols[1]).text().trim();
        const time = $(cols[2]).text().trim();
        const venue = $(cols[3]).text().trim();
        
        // MyGameDay uses specific columns for scores and opponent names
        const wscore = $(cols[4]).text().trim(); 
        const opponent = $(cols[6]).text().trim();
        const ascore = $(cols[7]).text().trim();

        // Skip header rows (usually labeled 'Rnd' or 'Round') and empty rows
        if (date && round.toLowerCase() !== 'rnd' && round.toLowerCase() !== 'round') {
          games.push({ 
            round, 
            date, 
            time, 
            venue, 
            wscore, 
            opponent, 
            ascore 
          });
        }
      }
    });

    return games;
  } catch (err) {
    console.error("Scraper Service Error (Games):", err);
    throw new Error("Failed to parse games data from source.");
  }
};