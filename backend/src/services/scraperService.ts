import puppeteer, { Browser, Page } from 'puppeteer';

interface LadderEntry {
  pos: string;
  team: string;
  p: string;
  w: string;
  d: string;
  l: string;
  f: string;
  a: string;
  gd: string;
  pts: string;
}

interface GameEntry {
  round: string;
  date: string;
  time: string;
  venue: string;
  wscore: string;
  opponent: string;
  ascore: string;
}

export const scrapeLadderData = async (url: string): Promise<LadderEntry[]> => {
  const browser: Browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page: Page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForSelector('table tbody tr', { timeout: 20000 });

    const ladder = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));

      return rows.map(row => {
        const cols = Array.from(row.querySelectorAll('td')).map(td => td.textContent?.trim() || '');

        // Row 0 is the header row (22 cols, first col is league name) — skip it
        // Data rows have 24 cols, first col is a number (position)
        if (cols.length < 16) return null;
        if (!/^\d+$/.test(cols[0])) return null;

        // From debug output, exact column mapping is:
        // [0] pos, [1] "" (logo), [2] team, [3] P, [4] W, [5] D, [6] L,
        // [7] ET Won, [8] ET Lost, [9] Pen Won, [10] Pen Lost, [11] Byes, [12] Forfeits,
        // [13] GF, [14] GA, [15] GD, [16] Avg, [17] Pts
        return {
          pos:  cols[0],
          team: cols[2],
          p:    cols[3]  || '0',
          w:    cols[4]  || '0',
          d:    cols[5]  || '0',
          l:    cols[6]  || '0',
          f:    cols[13] || '0',   // GF (Goals For)
          a:    cols[14] || '0',   // GA (Goals Against)
          gd:   cols[15] || '0',   // GD
          pts:  cols[17] || '0',   // Pts
        };
      }).filter((item): item is LadderEntry => item !== null);
    });

    return ladder;
  } finally {
    await browser.close();
  }
};

export const scrapeGamesData = async (url: string): Promise<GameEntry[]> => {
  const browser: Browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page: Page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForSelector('div[id^="fixture-"]', { timeout: 20000 });

    const games = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('div[id^="fixture-"]'));

      return rows.map(row => {

        // --- TEAMS ---
        // From debug: [0] empty, [1] home team, [2] away team, [3] competition, [4] "Match Centre"
        // So filter out empty strings and known non-team values
        const teamEls = Array.from(row.querySelectorAll('.tw-font-medium'));
        const teamNames = teamEls
          .map(el => el.textContent?.trim() || '')
          .filter(t => t !== '' && t !== 'Match Centre' && !t.includes('|') && !t.includes('League'));

        const homeTeam = teamNames[0] || '';
        const awayTeam = teamNames[1] || '';
        if (!homeTeam || !awayTeam) return null;

        // --- DATE ---
        // From debug innerHTML: <span class="tw-font-semibold">Fri</span>&nbsp;<span class="tw-font-normal">20 Mar 2026</span>
        // These are inside the LEFT panel div.tw-hidden.lg:tw-flex
        // The date text-level-1 div contains both the day name and date
        const leftPanel = row.closest('[id^="fixture-"]')?.parentElement
          ?.querySelector('.tw-hidden.lg\\:tw-flex.tw-flex-col');
        
        // Simpler: grab all text-level-1 elements and find the one with a date pattern
        const allTextLevel1 = Array.from(row.querySelectorAll('.text-level-1'));
        let date = '';
        for (const el of allTextLevel1) {
          const text = el.textContent?.trim() || '';
          // Match patterns like "Fri 20 Mar 2026"
          if (/\d{1,2}\s+\w{3}\s+\d{4}/.test(text)) {
            // Extract just the date part "20 Mar 2026", strip the day name
            const match = text.match(/(\d{1,2}\s+\w{3}\s+\d{4})/);
            if (match) { date = match[1]; break; }
          }
        }

        // --- TIME ---
        // From debug innerHTML: class="text-level-3 pt-2" contains "20:30"
        // Also appears in the centre score box as a fallback for unplayed games
        let time = '';
        const timeEl = row.querySelector('.text-level-3');
        if (timeEl) {
          const text = timeEl.textContent?.trim() || '';
          if (/^\d{2}:\d{2}$/.test(text)) time = text;
        }
        // Fallback: centre score area shows time for unplayed matches
        if (!time) {
          const allEls = Array.from(row.querySelectorAll('span'));
          for (const el of allEls) {
            const text = el.textContent?.trim() || '';
            if (/^\d{2}:\d{2}$/.test(text)) { time = text; break; }
          }
        }

        // --- VENUE ---
        // From debug innerHTML: anchor tag inside the flex row at bottom of card
        // The venue anchor text is "McIvor Reserve  Pitch 1"
        const venueAnchor = row.querySelector('a[href*="maps.google.com"]');
        let venue = '';
        if (venueAnchor) {
          venue = venueAnchor.textContent?.trim().replace(/\s+/g, ' ') || '';
        }

        // --- ROUND ---
        // From debug innerHTML: right panel has <span class="text-level-1 tw-font-semibold mb-8">Round 1</span>
        let round = '';
        const roundSpans = Array.from(row.querySelectorAll('span.tw-font-semibold'));
        for (const span of roundSpans) {
          const text = span.textContent?.trim() || '';
          if (/^Round\s+\d+/i.test(text)) { round = text; break; }
        }

        // --- SCORES ---
        // Unplayed games show "-" or the time in the centre box, not a score.
        // Played games will show "X - Y". We look for that specific pattern.
        let homeScore = '';
        let awayScore = '';
        const allSpans = Array.from(row.querySelectorAll('span, div'));
        for (const el of allSpans) {
          const text = el.textContent?.trim() || '';
          const scoreMatch = text.match(/^(\d{1,3})\s*[-–]\s*(\d{1,3})$/);
          if (scoreMatch) {
            homeScore = scoreMatch[1];
            awayScore = scoreMatch[2];
            break;
          }
        }

        if (!date) return null;

        return {
          round,
          date,
          time,
          venue,
          wscore: homeScore,
          opponent: awayTeam,
          ascore: awayScore,
        };
      }).filter((g): g is GameEntry => g !== null);
    });

    return games;
  } finally {
    await browser.close();
  }
};