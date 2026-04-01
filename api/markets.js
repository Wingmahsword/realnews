// Vercel serverless function: /api/markets
// Fetches live crypto from CoinGecko (free, no key) and
// stocks/indices from Alpha Vantage (needs ALPHA_VANTAGE_KEY env var)

function generateFallbackSparkline(basePrice, volatility = 0.02, points = 24) {
  const data = [];
  let price = basePrice;
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, price * 0.8);
    data.push(parseFloat(price.toFixed(2)));
  }
  return data;
}

async function fetchCrypto() {
  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum&sparkline=true&price_change_percentage=24h&x_cg_demo_api_key=CG-free';
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  return res.json();
}

async function fetchAlphaVantage(symbol, apiKey) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Alpha Vantage error: ${res.status}`);
  const data = await res.json();
  return data['Global Quote'];
}

async function fetchAlphaSparkline(symbol, apiKey) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&outputsize=compact&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const series = data['Time Series (60min)'];
  if (!series) return null;
  return Object.values(series).slice(0, 24).reverse().map(v => parseFloat(v['4. close']));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const alphaKey = process.env.ALPHA_VANTAGE_KEY;
  const result = {
    crypto: [],
    stocks: [],
    lastUpdated: new Date().toISOString(),
  };

  // ── Crypto from CoinGecko ──────────────────────────────────────
  try {
    const cryptoData = await fetchCrypto();
    result.crypto = cryptoData.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      sparkline: coin.sparkline_in_7d?.price?.slice(-24) ??
        generateFallbackSparkline(coin.current_price, 0.015),
    }));
  } catch (e) {
    // Fallback crypto data
    result.crypto = [
      {
        id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin',
        price: 83000, change24h: 1.8,
        sparkline: generateFallbackSparkline(83000, 0.02),
      },
      {
        id: 'ethereum', symbol: 'ETH', name: 'Ethereum',
        price: 1820, change24h: -0.7,
        sparkline: generateFallbackSparkline(1820, 0.025),
      },
    ];
  }

  // ── Stocks from Alpha Vantage ──────────────────────────────────
  if (alphaKey) {
    try {
      const [spyQuote, niftyQuote] = await Promise.allSettled([
        fetchAlphaVantage('SPY', alphaKey),
        fetchAlphaVantage('INFY', alphaKey), // Infosys as NIFTY proxy (AV doesn't support ^NSEI on free)
      ]);

      const [spySpark, niftySpark] = await Promise.allSettled([
        fetchAlphaSparkline('SPY', alphaKey),
        fetchAlphaSparkline('INFY', alphaKey),
      ]);

      if (spyQuote.status === 'fulfilled' && spyQuote.value) {
        const q = spyQuote.value;
        const price = parseFloat(q['05. price']);
        const change = parseFloat(q['10. change percent']);
        result.stocks.push({
          symbol: 'S&P 500',
          name: 'S&P 500 (SPY)',
          price,
          change24h: isNaN(change) ? 0 : change,
          sparkline: spySpark.status === 'fulfilled' && spySpark.value
            ? spySpark.value
            : generateFallbackSparkline(price, 0.008),
        });
      }

      if (niftyQuote.status === 'fulfilled' && niftyQuote.value) {
        const q = niftyQuote.value;
        const price = parseFloat(q['05. price']);
        const change = parseFloat(q['10. change percent']);
        result.stocks.push({
          symbol: 'NIFTY',
          name: 'NIFTY (INFY)',
          price,
          change24h: isNaN(change) ? 0 : change,
          sparkline: niftySpark.status === 'fulfilled' && niftySpark.value
            ? niftySpark.value
            : generateFallbackSparkline(price, 0.01),
        });
      }
    } catch (e) {
      result.stocks = [];
    }
  }

  // Fallback stock data if no Alpha Vantage key or all requests failed
  if (result.stocks.length === 0) {
    result.stocks = [
      {
        symbol: 'S&P 500', name: 'S&P 500 Index',
        price: 5611, change24h: 0.43,
        sparkline: generateFallbackSparkline(5611, 0.008),
        isFallback: true,
      },
      {
        symbol: 'NIFTY', name: 'NIFTY 50 Index',
        price: 22400, change24h: 0.61,
        sparkline: generateFallbackSparkline(22400, 0.009),
        isFallback: true,
      },
    ];
  }

  return res.status(200).json(result);
}
