import { useState, useEffect } from 'react';

interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  source: { name: string };
  publishedAt: string;
}

/** Truncates a headline to the first 6 words for social sharing */
function truncateTo6Words(title: string): string {
  if (!title) return '';
  const words = title.split(' ');
  return words.length <= 6 ? title : words.slice(0, 6).join(' ') + '...';
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ 
        width: 48, height: 48, border: '3px solid #1e3a5f', 
        borderTopColor: '#3b82f6', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Article | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // In dev: Vite proxy /api/news → newsapi.org (see vite.config.ts)
    // In prod: Vercel serverless function at /api/news handles the request server-side
    const url = '/api/news';

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`News API error: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        if (data.status === 'error') throw new Error(data.message ?? 'Unknown API error');
        const good = (data.articles ?? []).filter(
          (a: Article) => a.title && a.urlToImage && !a.title.includes('[Removed]')
        );
        setArticles(good);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleShare = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    const title = truncateTo6Words(article.title);
    const text = `${title}\n${article.url}`;

    if (typeof navigator.share === 'function' && navigator.canShare?.({ text })) {
      navigator.share({ title, text, url: article.url }).catch(() => {
        // User cancelled or not supported — fall back silently
        navigator.clipboard.writeText(text);
      });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  // ------------------------------------------------------------------ styles
  const page: React.CSSProperties = {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top right, #0f2444 0%, #080d1a 60%)',
    color: '#e2e8f0',
    fontFamily: "'Inter', system-ui, sans-serif",
  };

  const navStyle: React.CSSProperties = {
    position: 'sticky', top: 0, zIndex: 50,
    background: 'rgba(8,13,26,0.88)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(59,130,246,0.15)',
    padding: '0 24px',
  };

  const navInner: React.CSSProperties = {
    maxWidth: 1280, margin: '0 auto',
    height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  };

  return (
    <div style={page}>
      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <nav style={navStyle}>
        <div style={navInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              borderRadius: 6, width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 13, color: '#fff', letterSpacing: '-0.5px'
            }}>FN</div>
            <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>
              <span style={{ color: '#fff' }}>FOS</span>
              <span style={{ color: '#3b82f6' }}>NEWS</span>
            </span>
            <span style={{
              background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
              color: '#60a5fa', fontSize: 11, fontWeight: 700, padding: '3px 10px',
              borderRadius: 20, letterSpacing: '0.5px'
            }}>BUSINESS & TECH · US</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#dc2626', color: '#fff', fontSize: 11,
              fontWeight: 800, letterSpacing: 1, padding: '6px 14px', borderRadius: 4
            }}>
              <span style={{
                width: 7, height: 7, background: '#fff', borderRadius: '50%',
                animation: 'pulse 1.2s ease infinite'
              }} />
              LIVE
            </span>
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      </nav>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Copy toast */}
        {copied && (
          <div style={{
            position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            background: '#1d4ed8', color: '#fff', padding: '12px 24px', borderRadius: 8,
            fontSize: 14, fontWeight: 600, zIndex: 200, boxShadow: '0 8px 32px rgba(29,78,216,0.4)'
          }}>
            ✓ 6-word headline copied to clipboard!
          </div>
        )}

        {loading && <LoadingSpinner />}

        {error && (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            color: '#f87171', background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, maxWidth: 480, margin: '0 auto'
          }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Failed to load news</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>{error}</div>
          </div>
        )}

        {!loading && !error && (
          <>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '2px', color: '#60a5fa', textTransform: 'uppercase', marginBottom: 4 }}>
                TOP HEADLINES
              </h1>
              <div style={{ height: 2, background: 'linear-gradient(to right, #2563eb, transparent)', width: 80 }} />
            </div>

            {/* 3-column responsive grid */}
            <div className="grid-news">
              {articles.map((article, i) => (
                <article
                  key={i}
                  onClick={() => setSelected(article)}
                  className="news-card"
                  style={{
                    background: 'rgba(15,23,42,0.7)',
                    border: '1px solid rgba(59,130,246,0.1)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.4)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(59,130,246,0.12)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.1)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Image */}
                  <div style={{ height: 200, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                    <img
                      src={article.urlToImage!}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div style={{
                      position: 'absolute', top: 10, left: 10,
                      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                      borderRadius: 4, padding: '3px 8px', fontSize: 11, fontWeight: 600, color: '#cbd5e1'
                    }}>
                      {article.source.name}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '16px 18px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <h2 style={{
                      fontSize: 15, fontWeight: 700, lineHeight: 1.5, color: '#f1f5f9',
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden', margin: 0
                    }}>
                      {article.title}
                    </h2>
                    <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, marginTop: 'auto' }}>
                      Click to read more →
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 18px', borderTop: '1px solid rgba(59,130,246,0.1)',
                    background: 'rgba(0,0,0,0.2)'
                  }}>
                    <span style={{ fontSize: 11, color: '#64748b' }}>
                      {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button
                      onClick={e => handleShare(article, e)}
                      title="Share (first 6 words only)"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#3b82f6', padding: '4px 6px', borderRadius: 6,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.15)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <ShareIcon />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── SLIDE-OVER PANEL ──────────────────────────────────────── */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, overflow: 'hidden' }}>
          {/* Backdrop */}
          <div
            className="fade-overlay"
            onClick={() => setSelected(null)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          />

          {/* Panel */}
          <div className="slide-panel" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', background: '#0a1628', borderLeft: '1px solid rgba(59,130,246,0.2)', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: '1px solid rgba(59,130,246,0.1)',
              position: 'sticky', top: 0, background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(12px)', zIndex: 2
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 3, height: 20, background: '#3b82f6', borderRadius: 2 }} />
                <span style={{ fontWeight: 700, fontSize: 15 }}>Article Details</span>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                }}
                onMouseEnter={e => { (e.currentTarget).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget).style.color = '#94a3b8'; }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Image */}
            {selected.urlToImage && (
              <div style={{ position: 'relative', height: 260, flexShrink: 0 }}>
                <img src={selected.urlToImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a1628 0%, transparent 60%)' }} />
              </div>
            )}

            {/* Content */}
            <div style={{ padding: '24px 28px 48px', flex: 1 }}>
              <div style={{
                display: 'inline-block', fontSize: 11, fontWeight: 800, letterSpacing: '1.5px',
                textTransform: 'uppercase', color: '#60a5fa',
                background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
                borderRadius: 20, padding: '4px 12px', marginBottom: 16
              }}>
                {selected.source.name}
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.35, color: '#f8fafc', marginBottom: 16 }}>
                {selected.title}
              </h2>

              <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 32 }}>
                {selected.description ?? 'No additional description is available for this headline. Click "Read Full Story" to see the complete article.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Read full story */}
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#fff', fontWeight: 700, fontSize: 14, padding: '14px 24px',
                    borderRadius: 10, textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(37,99,235,0.35)', transition: 'opacity 0.15s'
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '0.9'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '1'}
                >
                  READ FULL STORY <ExternalLinkIcon />
                </a>

                {/* Share */}
                <button
                  onClick={e => handleShare(selected, e)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)',
                    color: '#60a5fa', fontWeight: 600, fontSize: 14, padding: '12px 24px',
                    borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => (e.currentTarget).style.background = 'rgba(59,130,246,0.15)'}
                  onMouseLeave={e => (e.currentTarget).style.background = 'rgba(59,130,246,0.08)'}
                >
                  <ShareIcon /> Share (6-word title)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive grid CSS */}
      <style>{`
        .grid-news {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .grid-news { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .grid-news { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
