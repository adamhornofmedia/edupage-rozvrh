import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const fetch = (await import('node-fetch')).default;

  const url = 'https://sspvc.edupage.org/timetable/server/currenttt.js?__func=curentttGetData';
  const headers = {
    'accept': '*/*',
    'content-type': 'application/json; charset=UTF-8',
    'origin': 'https://sspvc.edupage.org',
    'referer': 'https://sspvc.edupage.org/',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
    // Další hlavičky můžeš přidat podle potřeby
    'cookie': 'PHPSESSID=ca55e9561fd4e12fb960c6d98392ee63'
  };
  const body = JSON.stringify({
    "__args": [null, {
      "year": 2025,
      "datefrom": "2025-09-01",
      "dateto": "2025-09-07",
      "table": "classes",
      "id": "-30",
      "showColors": true,
      "showIgroupsInClasses": false,
      "showOrig": true,
      "log_module": "CurrentTTView"
    }],
    "__gsh": "00000000"
  });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body
  });

  const data = await response.json();
  res.status(200).json(data);
}