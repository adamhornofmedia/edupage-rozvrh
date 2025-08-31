import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const url = 'https://sspvc.edupage.org/timetable/view.php?week=2025-W36&student=-465';
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const timetable = [];
  $('table.timetable tr').each((i, tr) => {
    const tds = $(tr).find('td');
    if (tds.length >= 5) {
      timetable.push({
        den: $(tds[0]).text().trim(),
        hodina: $(tds[1]).text().trim(),
        predmet: $(tds[2]).text().trim(),
        ucitel: $(tds[3]).text().trim(),
        mistnost: $(tds[4]).text().trim(),
      });
    }
  });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ rozvrh: timetable });
}