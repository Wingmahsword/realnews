export default async function handler(req, res) {
  const apiKey = process.env.VITE_NEWS_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // 3 parallel requests
    const fetchNews = (url) => fetch(url).then(r => r.json());

    // 1. Indian Local News
    // 2. Global Conflict / Trump
    // 3. Subliminal / Iran War / US India relations
    // Using top-headlines with specific queries/categories for better free-tier resilience
    
    const [globalRes, subRes, indianRes] = await Promise.all([
      // 1. Global Conflict / War / Trump
      fetchNews(`https://newsapi.org/v2/everything?q=${encodeURIComponent('Trump OR war OR conflict')}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${apiKey}`),
      // 2. Market Intelligence / Economy / Iran
      fetchNews(`https://newsapi.org/v2/everything?q=${encodeURIComponent('economy OR market OR Iran')}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${apiKey}`),
      // 3. Indian National News
      fetchNews(`https://newsapi.org/v2/top-headlines?country=in&pageSize=12&apiKey=${apiKey}`)
    ]);

    // Check for rate limits or API errors
    if (globalRes.status === 'error') throw new Error(globalRes.message);
    if (subRes.status === 'error') throw new Error(subRes.message);
    if (indianRes.status === 'error') throw new Error(indianRes.message);

    // Format output
    const formatArticles = (data) => {
      if (data && data.articles) {
        return data.articles.filter(a => a.title && a.urlToImage && !a.title.includes('[Removed]'));
      }
      return [];
    };

    const data = {
      global: formatArticles(globalRes),
      subliminal: formatArticles(subRes), // Markets
      indian: formatArticles(indianRes)
    };

    // Allow CORS from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300'); // cache 5 mins
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news', message: err.message });
  }
}
