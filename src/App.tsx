import { newsArticles, breakingNews } from './data/mockData';

function App() {
  const featuredArticle = newsArticles[0];
  const sideArticles = newsArticles.slice(1, 3);
  const gridArticles = newsArticles.slice(3, 7);
  const listArticles = newsArticles.slice(1);

  return (
    <>
      <div className="ticker-wrap">
        <span className="ticker-label">BREAKING</span>
        <div className="ticker-content">
          {breakingNews.map((news, idx) => (
            <span key={idx} className="ticker-item">{news}</span>
          ))}
          {breakingNews.map((news, idx) => (
            <span key={`dup-${idx}`} className="ticker-item">{news}</span>
          ))}
        </div>
      </div>

      <nav>
        <div className="nav-inner">
          <div className="nav-logo">
            <div className="nav-logo-mark">FN</div>
            <div className="nav-logo-text">FOS<span>NEWS</span></div>
          </div>
          <ul className="nav-links">
            <li><a href="#" className="active">Home</a></li>
            <li><a href="#">World</a></li>
            <li><a href="#">Politics</a></li>
            <li><a href="#">Business</a></li>
            <li><a href="#">Tech</a></li>
            <li><a href="#">Science</a></li>
            <li><a href="#">Health</a></li>
            <li><a href="#">Sports</a></li>
          </ul>
          <div className="nav-right">
            <input type="text" className="nav-search" placeholder="Search news..." />
            <button className="btn-live">
              WATCH LIVE
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="featured-grid">
          <div className="featured-main">
            <img src={featuredArticle.imageUrl} alt={featuredArticle.headline} />
            <div className="featured-overlay"></div>
            <div className="featured-content">
              <span className={`category-badge ${featuredArticle.category}`}>{featuredArticle.category}</span>
              <div className="featured-meta" style={{ marginTop: '12px' }}>
                <time>{featuredArticle.timestamp}</time>
                <time>{featuredArticle.readTime}</time>
              </div>
              <h1 className="featured-truncated">
                {featuredArticle.headline.substring(0, 50)}...
              </h1>
              <p className="featured-excerpt">{featuredArticle.excerpt}</p>
              <a href={`/article/${featuredArticle.id}`} className="read-more-btn">
                Read Full Story
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="featured-side">
            {sideArticles.map(article => (
              <div key={article.id} className="side-article">
                <img src={article.imageUrl} alt={article.headline} />
                <div className="side-overlay"></div>
                <div className="side-content">
                  <span className={`category-badge ${article.category}`}>{article.category}</span>
                  <div style={{ marginTop: '8px' }}>
                    <h3 className="side-headline">
                      {article.headline.substring(0, 45)}...
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="section-heading">
          <h2>Latest Updates</h2>
        </div>

        <section className="news-grid">
          {gridArticles.map(article => (
            <div key={article.id} className="news-card" onClick={() => window.location.href = `/article/${article.id}`}>
              <div className="news-card-img">
                <img src={article.imageUrl} alt={article.headline} />
              </div>
              <div className="news-card-body">
                <div className="news-card-meta">
                  <span className={`category-badge ${article.category}`}>{article.category}</span>
                  <time>{article.timestamp}</time>
                </div>
                <h3 className="news-card-headline">
                  {article.headline.substring(0, 35)}...
                </h3>
                <span className="news-card-teaser">Click to read full story &rarr;</span>
              </div>
              <div className="news-card-footer">
                <span className="news-card-author">By {article.author}</span>
                <span className="news-card-readmore">Read {article.readTime}</span>
              </div>
            </div>
          ))}
        </section>

        <div className="section-heading">
          <h2>More Top Stories</h2>
        </div>

        <section className="news-list">
          {listArticles.map(article => (
            <div key={article.id} className="list-article" onClick={() => window.location.href = `/article/${article.id}`}>
              <div className="list-article-img">
                <img src={article.imageUrl} alt={article.headline} />
              </div>
              <div className="list-article-body">
                <div className="list-article-meta">
                  <span className={`category-badge ${article.category}`}>{article.category}</span>
                  <span>{article.timestamp}</span>
                </div>
                <h3 className="list-article-headline">
                  {article.headline.substring(0, 40)}...
                </h3>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">FOS<span>NEWS</span></div>
              <p className="footer-desc">Delivering the most accurate, unbiased, and comprehensive news coverage from around the globe, 24/7.</p>
            </div>
            <div className="footer-col">
              <h4>Categories</h4>
              <ul>
                <li><a href="#">World News</a></li>
                <li><a href="#">Politics & Policy</a></li>
                <li><a href="#">Global Economy</a></li>
                <li><a href="#">Technology & Science</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Journalistic Ethics</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <ul>
                <li><a href="#">Twitter / X</a></li>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} FOS News Network. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
