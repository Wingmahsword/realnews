export default async function handler(req, res) {
  const apiKey = process.env.VITE_NEWS_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=20&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    // Allow CORS from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300'); // cache 5 mins
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news', message: err.message });
  }
}
