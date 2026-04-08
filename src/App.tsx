import { useState, useEffect, useRef } from 'react';
import { Analytics } from "@vercel/analytics/react";

interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  source: { name: string };
  publishedAt: string;
  content: string | null;
}

function truncateHeadline(title: string, words: number): string {
  if (!title) return '';
  const arr = title.split(' ');
  return arr.length <= words ? title : arr.slice(0, words).join(' ') + '...';
}

function SubliminalTicker({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;
  
  // Duplicate array for seamless infinite scrolling
  const displayArticles = [...articles, ...articles, ...articles];

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 overflow-hidden relative flex items-center h-12 mt-16 z-40 shadow-sm">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute left-4 z-20">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded flex items-center gap-2 whitespace-nowrap backdrop-blur-md">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
          REAL-TIME ALERTS
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden pl-40">
        <div className="animate-marquee items-center flex gap-12 whitespace-nowrap">
          {displayArticles.map((article, i) => (
            <div key={i} className="flex items-center gap-3 group cursor-pointer" onClick={() => window.open(article.url, '_blank')}>
              <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">{article.source.name}</span>
              <span className="text-sm font-semibold text-slate-300 group-hover:text-blue-400 transition-colors">
                {article.title}
              </span>
              <span className="text-slate-700 ml-6 text-xl">•</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
    </div>
  );
}

function ShareModal({ title, isOpen, onClose }: { title: string, isOpen: boolean, onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.origin;
  const shareTitle = `FOS NEWS: ${title}`;

  if (!isOpen) return null;

  const apps = [
    { 
      name: 'WhatsApp', 
      color: '#25D366',
      icon: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`
    },
    { 
      name: 'Instagram', 
      color: '#E4405F',
      icon: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
      action: () => {
        if (navigator.share) {
          navigator.share({ title: shareTitle, url: shareUrl });
        } else {
          window.open(`https://www.instagram.com/`, '_blank');
        }
      }
    },
    { 
      name: 'Snapchat', 
      color: '#FFFC00',
      icon: <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-4.971 0-9 4.029-9 9 0 .237.01.474.03.708l-.022.016c-.032.022-.058.057-.08.092-.519.8-.728 1.737-.585 2.658.143.92.519 1.737 1.057 2.37.032.046.069.092.11.127l.033.023-.003.003c.121 1.443.839 2.738 1.954 3.565.11.08.221.162.342.231l.034.02-.004.004c2.208 1.258 4.887 1.258 7.095 0l-.004-.004.034-.02c.121-.069.232-.15.342-.231 1.115-.827 1.833-2.122 1.954-3.565l-.003-.003.033-.023c.041-.035.078-.081.11-.127.538-.633.914-1.45 1.057-2.37.143-.921-.066-1.858-.585-2.658-.022-.035-.048-.07-.08-.092l-.022-.016c.02-.234.03-.471.03-.708 0-4.971-4.029-9-9-9z"/></svg>,
      action: () => {
        if (navigator.share) {
          navigator.share({ title: shareTitle, url: shareUrl });
        } else {
          window.open(`https://www.snapchat.com/`, '_blank');
        }
      }
    },
    { 
      name: 'Threads', 
      color: '#FFFFFF',
      icon: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M15.111 11.666c-.333-.333-.666-.333-1 0-.333.333-.333.666 0 1 .333.333.666.333 1 0 .333-.333.333-.666 0-1zm-3.111-3.666c-.333-.333-.666-.333-1 0-.333.333-.333.666 0 1 .333.333.666.333 1 0 .333-.333.333-.666 0-1zm6.111 6.666c-.333-.333-.666-.333-1 0-.333.333-.333.666 0 1 .333.333.666.333 1 0 .333-.333.333-.666 0-1zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>,
      url: `https://www.threads.net/intent/post?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="share-backdrop" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        
        <div className="share-header">
          <span className="text-sm font-bold text-white">Share</span>
        </div>

        <div className="share-grid-container p-6">
          <div className="share-grid">
            {apps.map((app, i) => (
              <div key={i} className="share-col">
                {app.url ? (
                  <a href={app.url} target="_blank" rel="noreferrer" className="share-app-icon" onClick={onClose}>
                    <div style={{ color: app.color }}>{app.icon}</div>
                  </a>
                ) : (
                  <button className="share-app-icon" onClick={() => { app.action?.(); onClose(); }}>
                    <div style={{ color: app.color }}>{app.icon}</div>
                  </button>
                )}
                <span className="share-label">{app.name}</span>
              </div>
            ))}
            <div className="share-col" onClick={copyToClipboard}>
              <div className={`share-app-icon ${copied ? 'bg-green-500 border-green-500' : ''}`}>
                {copied ? (
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </div>
              <span className="share-label">{copied ? 'Copied' : 'Copy Link'}</span>
            </div>
          </div>
        </div>

        <div className="pb-4" />
      </div>
    </div>
  );
}

function ShareButton({ title, className = "" }: { title: string, className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: `FOS NEWS: ${title}`,
        text: title,
        url: window.location.origin,
      }).catch(() => setIsOpen(true));
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <button 
        onClick={handleShareClick}
        className={`w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center hover:bg-slate-800 hover:border-slate-700 transition-all text-slate-400 hover:text-white ${className}`}
        title="Share this article"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
      <ShareModal title={title} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all flex flex-col">
      <div className="relative h-56 overflow-hidden">
        <img src={article.urlToImage!} loading="lazy" alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
          <div className="flex items-center gap-2">
            <ShareButton title={article.title} />
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
      </div>
    </article>
  );
}

export default function App() {
  const [news, setNews] = useState<{indian: Article[], global: Article[], subliminal: Article[]}>({ indian: [], global: [], subliminal: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRSS = async () => {
      const FEEDS = [
        { url: 'https://news.google.com/rss/search?q=iran+war+india+trump+modi&hl=en-IN&gl=IN&ceid=IN:en', label: 'WORLD' },
        { url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', label: 'INDIA' }
      ];

      try {
        const allIndian: any[] = [];
        const allGlobal: any[] = [];
        
        for (const feed of FEEDS) {
          const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
          const data = await res.json();
          if (data.items) {
            data.items.forEach((item: any) => {
              const article = {
                title: item.title,
                url: item.link,
                urlToImage: item.thumbnail || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000",
                source: { name: feed.label },
                publishedAt: item.pubDate,
                description: item.description?.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...'
              };
              if (feed.label === 'INDIA') allIndian.push(article);
              else allGlobal.push(article);
            });
          }
        }

        setNews({
          indian: allIndian.slice(0, 12),
          global: allGlobal.slice(0, 8),
          subliminal: [...allIndian, ...allGlobal].sort(() => 0.5 - Math.random()).slice(0, 15)
        });
        setError(null);
      } catch (err: any) {
        console.error("RSS Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRSS();
    const interval = setInterval(fetchRSS, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  const scrollToFeatured = () => {
    featuredRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950"></div>
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin z-10 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
      </div>
    );
  }

  // Combine fallback: If global API fails, use indian news for hero
  const heroCandidates = news.global.length > 0 ? news.global : news.indian;
  const featured = heroCandidates[0];
  const globalRest = news.global.slice(1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded flex items-center justify-center font-black text-xs shadow-lg shadow-blue-500/20">FN</div>
          <span className="text-lg font-black tracking-tighter">FOS<span className="text-blue-500">NEWS</span></span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <a href="/india.html" className="text-[10px] sm:text-xs font-bold text-slate-300 hover:text-white uppercase tracking-widest transition-colors sm:mr-2 whitespace-nowrap">
            🇮🇳 <span className="hidden sm:inline">India Section</span><span className="inline sm:hidden">India</span>
          </a>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-red-500/10 text-red-500 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest border border-red-500/20">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shrink-0"></span>
            LIVE
          </div>
        </div>
      </nav>

      {/* --- TICKER SECTION --- */}
      <SubliminalTicker articles={news.subliminal} />

      {/* --- HERO SECTION --- */}
      {featured && (
        <section className="relative h-[calc(100vh-4rem-3rem)] flex flex-col justify-end pb-24 px-6 md:px-12 overflow-hidden">
          <img 
            src={featured.urlToImage!} 
            alt="Hero Headline Cover" 
            className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.35] scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
          
          <div className="relative z-20 max-w-4xl">
            <span className="inline-block px-3 py-1 bg-blue-600 text-[10px] font-black uppercase tracking-widest rounded mb-4 shadow-lg shadow-blue-500/20">Breaking Story</span>
            <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
              {truncateHeadline(featured.title, 12)}
            </h1>
            <div className="flex items-center gap-4">
              <button 
                onClick={scrollToFeatured}
                className="group flex items-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-full font-bold transition-all hover:bg-blue-600 hover:text-white shadow-xl"
              >
                READ FULL STORY
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <ShareButton 
                title={featured.title} 
                className="!relative bg-slate-900 border-slate-700" 
              />
            </div>
          </div>
        </section>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-center">
            <span className="font-bold">Error:</span> {error}
          </div>
        </div>
      )}

      {/* --- GLOBAL CONFLICT & TENSIONS GRID --- */}
      {globalRest.length > 0 && (
        <main className="max-w-7xl mx-auto py-16 px-6">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter shrink-0">Global <span className="text-blue-500">Conflict</span></h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {globalRest.slice(0, 6).map((article, i) => (
              <ArticleCard key={`global-${i}`} article={article} />
            ))}
          </div>
        </main>
      )}

      {/* --- INDIAN LOCAL NEWS GRID --- */}
      {news.indian.length > 0 && (
        <section className="bg-slate-900/50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter shrink-0">Local <span className="text-emerald-500">India</span> News</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.indian.slice(0, 9).map((article, i) => (
                <ArticleCard key={`indian-${i}`} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- FEATURED DEEP DIVE SECTION --- */}
      {featured && (
        <section ref={featuredRef} className="bg-slate-900 py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="text-blue-500 text-xs font-black uppercase tracking-widest mb-6 block">Deep Dive Analysis</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-12 leading-tight">
              {featured.title}
            </h2>
            <img src={featured.urlToImage!} loading="lazy" alt="" className="w-full h-[300px] md:h-[500px] object-cover rounded-3xl mb-12 shadow-2xl shadow-blue-500/10" />
            <p className="text-xl text-slate-400 leading-relaxed mb-12">
              {featured.description || "The markets are reacting to the latest developments as the situation unfolds. FOS NEWS provides the essential context required to understand the long-term implications of today's headlines."}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a 
                href={featured.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-full font-black text-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30"
              >
                READ ORIGINAL SOURCE 
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Share this:</span>
                <ShareButton title={featured.title} className="!static" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- FOOTER --- */}
      <footer className="py-24 border-t border-slate-900 px-6 text-center bg-slate-950">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-xs shadow-lg shadow-blue-600/20">FN</div>
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
      <Analytics />
    </div>
  );
}
