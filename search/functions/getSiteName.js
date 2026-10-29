const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json({ limit: '10mb' }));


async function getSiteName(url) {
  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow'
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error();

    const reader = res.body.getReader();
    const chunks = [];
    let total = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      total += value.length;
      if (total >= 35000) break;
    }

    const html = Buffer.concat(chunks).toString('utf8');

    // JSON-LD
    const jsonldRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gi;
    let match;
    while ((match = jsonldRe.exec(html)) !== null) {
      try {
        let data = JSON.parse(match[1]);
        if (!Array.isArray(data)) data = [data];
        for (const item of data) {
          if (item && item['@type'] === 'WebSite' && item.name) {
            return item.name.trim();
          }
        }
      } catch {}
    }

    // og:site_name
    match = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i);
    if (match) return match[1].trim();

    // application-name
    match = html.match(/<meta[^>]+name=["']application-name["'][^>]+content=["']([^"']+)["']/i);
    if (match) return match[1].trim();

  } catch {}

  // Domain fallback
  try {
    const host = new URL(url.startsWith('http') ? url : 'https://' + url).hostname || '';
    const parts = host.toLowerCase().split('.');
    if (parts.length >= 2) {
      return parts[parts.length - 2].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
    return parts[0] ? parts[0].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : null;
  } catch {
    return null;
  }
}

app.post('/enrich', async (req, res) => {
  const payload = req.body;
  if (!payload || !Array.isArray(payload.results)) {
    return res.status(400).json({ error: 'bad payload' });
  }

  await Promise.all(
    payload.results.map(async (item) => {
      if (item.url) {
        const name = await getSiteName(item.url);
        item.site_name = name || "Unknown";   // never undefined/null
      } else {
        item.site_name = "Unknown";
      }
    })
  );

  res.json(payload);
});

app.listen(3001, () => {
  console.log('enrich server running on http://localhost:3001');
});
