import { useState, useEffect } from 'react';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  source: { name: string };
  publishedAt: string;
}

function truncateHeadline(title: string): string {
  if (!title) return '';
  const words = title.split(' ');
  if (words.length <= 6) return title;
  return words.slice(0, 6).join(' ') + '...';
}

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY || 'e60f33046b9342d69705f1b76f1e3b3d';
        const url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        setArticles(data.articles.filter((a: Article) => a.title && a.urlToImage));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const handleShare = async (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    const truncatedTitle = truncateHeadline(article.title);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: truncatedTitle,
          text: `Check out this news: ${truncatedTitle}`,
          url: article.url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(`${truncatedTitle}\n${article.url}`);
      alert("Link and custom 6-word title copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 font-sans">
      <nav className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                FOS NEWS
              </span>
              <span className="bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded-full font-medium">
                Business & Tech US
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <div className="text-center text-gray-400 py-20">Loading breaking news...</div>}
        {error && <div className="text-center text-red-400 py-20">Error: {error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedArticle(article)}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-800 hover:border-blue-500/50 transition-all duration-300 group flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={article.urlToImage} 
                    alt={article.source.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-xs px-2 py-1 rounded text-gray-200">
                    {article.source.name}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-gray-100 line-clamp-3 mb-4 leading-snug">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <span className="text-xs text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={(e) => handleShare(article, e)}
                      className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                      title="Share (6-word limit)"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Slide-over Panel Overlay */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm fade-in" onClick={() => setSelectedArticle(null)} />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex slide-panel">
            <div className="w-screen max-w-md">
              <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800 shadow-2xl">
                
                <div className="px-4 py-6 sm:px-6 flex items-center justify-between border-b border-gray-800">
                  <h2 className="text-lg font-medium text-gray-100">Article Details</h2>
                  <button onClick={() => setSelectedArticle(null)} className="text-gray-400 hover:text-white transition-colors p-2">
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto w-full">
                  <div className="relative h-64 w-full">
                    <img src={selectedArticle.urlToImage} alt={selectedArticle.source.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="px-4 sm:px-6 py-6 pb-20">
                    <span className="inline-block bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-medium mb-4">
                      {selectedArticle.source.name}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-100 mb-6 leading-tight">
                      {selectedArticle.title}
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed mb-8">
                      {selectedArticle.description || "No full description is available for this top headline."}
                    </p>
                    
                    <a 
                      href={selectedArticle.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-900/50"
                    >
                      Read Original Story
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
