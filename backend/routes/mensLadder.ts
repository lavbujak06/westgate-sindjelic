import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(
      'https://websites.mygameday.app/comp_info.cgi?c=0-8746-0-645818-0&pool=1&a=LADDER'
    );

    const html = await response.text();
    const $ = cheerio.load(html);

    const ladder: { pos: string; team: string; p: string; w: string; d: string; l: string; f: string; a: string; gd: string; pts: string; }[] = [];

    $('table tr').each((_, row) => {
      const cols = $(row).find('td');

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

    res.json(ladder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ladder' });
  }
});

export default router;
