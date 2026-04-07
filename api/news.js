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
    
    const [indianRes, globalRes, subRes] = await Promise.all([
      fetchNews(`https://newsapi.org/v2/top-headlines?country=in&pageSize=20&apiKey=${apiKey}`),
      fetchNews(`https://newsapi.org/v2/everything?q="(Trump OR war)"&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`),
      fetchNews(`https://newsapi.org/v2/everything?q="(Iran war OR US India relations OR Indian market)"&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`)
    ]);

    // Format output
    // Provide safe defaults if the API limits hits or fails
    const formatArticles = (data) => {
      if (data && data.articles) {
        return data.articles.filter(a => a.title && a.urlToImage && !a.title.includes('[Removed]'));
      }
      return [];
    };

    const data = {
      indian: formatArticles(indianRes),
      global: formatArticles(globalRes),
      subliminal: formatArticles(subRes)
    };

    // Allow CORS from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300'); // cache 5 mins
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news', message: err.message });
  }
}
