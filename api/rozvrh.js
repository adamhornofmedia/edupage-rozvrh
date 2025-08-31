
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const fetch = (await import('node-fetch')).default;

  // Načtení překladů z translate.json
  let translations = {};
  try {
    const translatePath = path.join(process.cwd(), 'translate.json');
    if (fs.existsSync(translatePath)) {
      translations = JSON.parse(fs.readFileSync(translatePath, 'utf8'));
    }
  } catch (e) {
    translations = {};
  }

  // Získání parametrů z body (POST) nebo query (GET)
  const {
    year = 2025,
    datefrom = '2025-09-01',
    dateto = '2025-09-07',
    table = 'classes',
    id = '-30',
    PHPSESSID = '',
    showColors = true,
    showIgroupsInClasses = false,
    showOrig = true
  } = req.method === 'POST' ? req.body : req.query;

  const url = 'https://sspvc.edupage.org/timetable/server/currenttt.js?__func=curentttGetData';
  const headers = {
    'accept': '*/*',
    'accept-language': 'cs,en;q=0.9,cs-CZ;q=0.8,sk;q=0.7',
    'cache-control': 'no-cache',
    'content-type': 'application/json; charset=UTF-8',
    'origin': 'https://sspvc.edupage.org',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://sspvc.edupage.org/',
    'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
    'cookie': `PHPSESSID=${PHPSESSID}`
  };
  const body = JSON.stringify({
    "__args": [null, {
      year: Number(year),
      datefrom,
      dateto,
      table,
      id,
      showColors,
      showIgroupsInClasses,
      showOrig,
      log_module: "CurrentTTView"
    }],
    "__gsh": "00000000"
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });
    const data = await response.json();

    // Funkce pro překlad ID na text
    function translate(id) {
      return translations[id] || id;
    }

    // Pokud data obsahují pole s rozvrhem (r.ttitems), přelož ID na texty
    if (data && data.r && Array.isArray(data.r.ttitems)) {
      data.r.ttitems = data.r.ttitems.map(item => {
        return {
          ...item,
          subject: translate(item.subjectid),
          teacher: Array.isArray(item.teacherids) && item.teacherids.length > 0 ? translate(item.teacherids[0]) : '',
          classroom: Array.isArray(item.classroomids) && item.classroomids.length > 0 ? translate(item.classroomids[0]) : ''
        };
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}