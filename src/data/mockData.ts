export interface NewsArticle {
  id: string;
  headline: string;
  category: string;
  timestamp: string;
  imageUrl: string;
  excerpt: string;
  author: string;
  readTime: string;
  isFeatured?: boolean;
}

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    headline: "Global Leaders Announce Landmark Climate Agreement That Could Reshape Energy Markets For Decades To Come",
    category: "WORLD",
    timestamp: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&q=80",
    excerpt: "In a historic summit held in Geneva, world leaders from over 40 nations signed a binding agreement to reduce carbon emissions by 60% before 2040, marking the most ambitious climate deal in history.",
    author: "Sarah Mitchell",
    readTime: "8 min read",
    isFeatured: true,
  },
  {
    id: "2",
    headline: "Tech Giants Face Unprecedented Antitrust Scrutiny As Regulators Push For Major Industry Restructuring Plans",
    category: "TECHNOLOGY",
    timestamp: "4 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    excerpt: "Federal regulators in the US and EU have launched coordinated investigations into the market dominance of major technology companies.",
    author: "James Chen",
    readTime: "6 min read",
  },
  {
    id: "3",
    headline: "Revolutionary Medical Breakthrough Offers Hope For Millions Suffering From Autoimmune Disorders Worldwide",
    category: "HEALTH",
    timestamp: "5 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    excerpt: "A team of researchers at MIT and Oxford University have developed a novel therapy that could fundamentally change treatment for autoimmune diseases.",
    author: "Dr. Elena Rodriguez",
    readTime: "10 min read",
  },
  {
    id: "4",
    headline: "Stock Markets Rally To Record Highs As Central Banks Signal Extended Period Of Monetary Policy Support",
    category: "FINANCE",
    timestamp: "6 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    excerpt: "Wall Street indices surged to new all-time highs following coordinated statements from the Federal Reserve and European Central Bank.",
    author: "Michael Torres",
    readTime: "5 min read",
  },
  {
    id: "5",
    headline: "Space Agency Reveals Stunning New Images From Deep Space Telescope Showing Previously Unknown Galaxies",
    category: "SCIENCE",
    timestamp: "7 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
    excerpt: "NASA's latest deep space observatory has captured breathtaking images revealing thousands of previously undetected galaxies in a small patch of sky.",
    author: "Amanda Wright",
    readTime: "7 min read",
  },
  {
    id: "6",
    headline: "International Sports Federation Announces Sweeping Reforms To Athlete Safety Protocols After Growing Concerns",
    category: "SPORTS",
    timestamp: "8 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-bd45ba7c5e28?w=800&q=80",
    excerpt: "The international governing body for athletics has unveiled comprehensive new safety guidelines aimed at protecting athletes from long-term injuries.",
    author: "David Park",
    readTime: "4 min read",
  },
  {
    id: "7",
    headline: "Award-Winning Director Unveils Ambitious New Film Project Featuring Groundbreaking Visual Effects Technology",
    category: "ENTERTAINMENT",
    timestamp: "9 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    excerpt: "The visionary filmmaker behind several blockbuster hits has announced a new cinematic experience pushing the boundaries of digital storytelling.",
    author: "Lisa Chang",
    readTime: "5 min read",
  },
  {
    id: "8",
    headline: "Major Infrastructure Bill Promises To Transform Urban Transportation Networks Across Multiple Metropolitan Areas",
    category: "POLITICS",
    timestamp: "10 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    excerpt: "Legislative leaders have unveiled a comprehensive infrastructure package worth over $500 billion targeting modernization of public transit systems.",
    author: "Robert Kim",
    readTime: "6 min read",
  },
];

export const breakingNews = [
  "Breaking: Emergency session called as diplomatic tensions escalate in Eastern Europe",
  "Markets update: Asian stocks surge on trade deal optimism",
  "Weather alert: Category 4 hurricane approaching Gulf Coast, evacuations ordered",
  "Tech: Major social media platform announces complete redesign launching next month",
];
