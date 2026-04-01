import { useState, useEffect, useRef } from 'react';

interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  source: { name: string };
  publishedAt: string;
  content: string | null;
}

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  sparkline: number[];
}

function truncateHeadline(title: string, words: number): string {
  if (!title) return '';
  const arr = title.split(' ');
  return arr.length <= words ? title : arr.slice(0, words).join(' ') + '...';
}

function Sparkline({ data, color }: { data: number[], color: string }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 20;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

function MarketTicker({ item }: { item: MarketData }) {
  const isPositive = item.change24h >= 0;
  const color = isPositive ? '#22c55e' : '#ef4444';
  
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm min-w-[160px]">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.symbol}</span>
        <span className="text-xs font-mono font-bold text-white">
          ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`text-[10px] font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(item.change24h).toFixed(2)}%
        </span>
        <Sparkline data={item.sparkline} color={color} />
      </div>
    </div>
  );
}

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [markets, setMarkets] = useState<{crypto: MarketData[], stocks: MarketData[]}>({ crypto: [], stocks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, marketRes] = await Promise.all([
          fetch('/api/news'),
          fetch('/api/markets')
        ]);
        
        const newsData = await newsRes.json();
        const marketData = await marketRes.json();

        if (newsData.status === 'error') throw new Error(newsData.message);
        
        const filtered = (newsData.articles ?? []).filter(
          (a: Article) => a.title && a.urlToImage && !a.title.includes('[Removed]')
        );
        
        setArticles(filtered);
        setMarkets({
          crypto: marketData.crypto || [],
          stocks: marketData.stocks || []
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const scrollToFeatured = () => {
    featuredRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-900/80 backdrop-blur-md border-bottom border-slate-800 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded flex items-center justify-center font-black text-xs">FN</div>
          <span className="text-lg font-black tracking-tighter">FOS<span className="text-blue-500">NEWS</span></span>
        </div>

        <div className="hidden md:flex items-center gap-4 overflow-x-auto no-scrollbar max-w-2xl px-4">
          {[...markets.crypto, ...markets.stocks].map((item, idx) => (
            <MarketTicker key={idx} item={item} />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-red-500/20">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            LIVE
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      {featured && (
        <section className="relative h-screen flex flex-col justify-end pb-24 px-6 md:px-12 overflow-hidden">
          <img 
            src={featured.urlToImage!} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.4] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
          
          <div className="relative z-20 max-w-4xl">
            <span className="inline-block px-3 py-1 bg-blue-600 text-[10px] font-black uppercase tracking-widest rounded mb-4">Featured Story</span>
            <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tighter mb-6">
              {truncateHeadline(featured.title, 8)}
            </h1>
            <button 
              onClick={scrollToFeatured}
              className="group flex items-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-full font-bold transition-all hover:bg-blue-600 hover:text-white"
            >
              READ FULL STORY
              <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </section>
      )}

      {/* --- NEWS GRID --- */}
      <main className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black tracking-tighter">Market <span className="text-blue-500">Insights</span></h2>
          <div className="h-px flex-1 bg-slate-800 mx-8"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-8 text-center">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((article, i) => (
            <article 
              key={i}
              className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={article.urlToImage!} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 left-4 inline-block px-2 py-1 bg-slate-950/80 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-wider">{article.source.name}</div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold leading-snug mb-4 line-clamp-3 group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* --- FEATURED DEEP DIVE SECTION --- */}
      {featured && (
        <section ref={featuredRef} className="bg-slate-900 py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="text-blue-500 text-xs font-black uppercase tracking-widest mb-6 block">Deep Dive Analysis</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-12 leading-tight">
              {featured.title}
            </h2>
            <img src={featured.urlToImage!} alt="" className="w-full h-[500px] object-cover rounded-3xl mb-12 shadow-2xl shadow-blue-500/10" />
            <p className="text-xl text-slate-400 leading-relaxed mb-12">
              {featured.description || "The markets are reacting to the latest developments as the situation unfolds. FOS NEWS provides the essential context required to understand the long-term implications of today's headlines."}
            </p>
            <a 
              href={featured.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-full font-black text-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
            >
              READ ORIGINAL AT SOURCE 
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        </section>
      )}

      {/* --- FOOTER --- */}
      <footer className="py-24 border-t border-slate-900 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-xs">FN</div>
          <span className="text-xl font-black tracking-tighter uppercase">FOS<span className="text-blue-500">NEWS</span></span>
        </div>
        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">Automated Market Intelligence Agency</p>
        <p className="text-slate-600 text-[10px] tracking-widest">© 2026 FOS NEWS NETWORK. ALL RIGHTS RESERVED.</p>
        <div className="mt-8 flex justify-center gap-6">
           <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,1)]"></div>
           <div className="w-2 h-2 rounded-full bg-slate-800"></div>
           <div className="w-2 h-2 rounded-full bg-slate-800"></div>
        </div>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
