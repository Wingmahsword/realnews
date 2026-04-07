# FOS News — India Section

## Files in this build
- `india.html` — Full India section page (Iran war, US-India, Trump, Markets)
- `sitemap.xml` — SEO sitemap for Google indexing
- `robots.txt` — Search engine crawler instructions

## How to push to your domain

```bash
git clone https://github.com/Wingmahsword/realnews.git
cd realnews

# Copy all files from this build into the repo
cp india.html sitemap.xml robots.txt ./

git add .
git commit -m "Add India section: Iran war, Trump, US-India, SEO, markets"
git push origin main
```

## SEO Keywords Embedded
- Iran war, Iran US war, Iran war India, Iran war update today
- Trump India, Trump Iran, Trump tariff India
- US India relations, US Iran conflict India impact
- India news today, breaking India news
- Sensex crash, crude oil India, rupee dollar, Strait of Hormuz India
- Chabahar port, India oil import, Indian economy war

## Performance features
- Zero JS frameworks — pure HTML/CSS
- Inline critical CSS (no render-blocking)
- Google Fonts with `display=swap`
- Preconnect hints for fonts
- No external JS libraries
- Compressed semantic HTML
- Sticky nav, live IST clock in JS (~800 bytes)
