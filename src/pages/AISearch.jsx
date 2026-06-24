import { useState } from 'react';
import { Link } from 'react-router-dom';
import { allProducts } from '../products';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import API from '../api';

const SUGGESTIONS = [
  "I need a laptop under $1500",
  "Best earbuds for gaming",
  "Smartwatch with long battery life",
  "Phone with best camera under $900",
  "Home electronics for smart home",
  "Beauty tech for hair styling",
  "Drone for beginners",
  "Wireless headphones with noise cancellation",
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= rating ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}>★</span>
      ))}
    </div>
  );
}

function AISearch() {
  const { addToCart }                    = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [searched, setSearched] = useState(false);
  const [history, setHistory]   = useState([]);

  const handleSearch = async (q = query) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    setResults([]);
    setAiMessage('');

    try {
      // Call Claude AI via backend
      const { data } = await API.post('/ai/search', { query: searchQuery });
      setResults(data.products || []);
      setAiMessage(data.message || '');
      setHistory(prev => [searchQuery, ...prev.filter(h => h !== searchQuery)].slice(0, 5));
    } catch (err) {
      // Fallback: client-side semantic search
      const matched = clientSideSearch(searchQuery);
      setResults(matched);
      setAiMessage(generateAIMessage(searchQuery, matched));
    } finally {
      setLoading(false);
    }
  };

  // Client-side AI-like semantic search
  const clientSideSearch = (q) => {
    const lower = q.toLowerCase();

    // Extract price constraint
    const priceMatch = lower.match(/under\s*\$?(\d+)/i) || lower.match(/below\s*\$?(\d+)/i) || lower.match(/less than\s*\$?(\d+)/i);
    const maxPrice = priceMatch ? parseInt(priceMatch[1]) : Infinity;

    // Keyword to category/feature mapping
    const intentMap = {
      laptop:      ['Laptops'],
      computer:    ['Laptops'],
      macbook:     ['Laptops'],
      phone:       ['Phones'],
      smartphone:  ['Phones'],
      iphone:      ['Phones'],
      samsung:     ['Phones'],
      tablet:      ['Tablets'],
      ipad:        ['Tablets'],
      camera:      ['Cameras'],
      photo:       ['Cameras'],
      watch:       ['Watches'],
      smartwatch:  ['Watches'],
      headphone:   ['Headphones'],
      earbud:      ['Headphones'],
      airpod:      ['Headphones'],
      wireless:    ['Headphones'],
      drone:       ['Drones'],
      accessory:   ['Accessories'],
      keyboard:    ['Accessories'],
      mouse:       ['Accessories'],
      charger:     ['Accessories'],
      tv:          ['Home Electronics'],
      speaker:     ['Home Electronics'],
      smart:       ['Home Electronics'],
      home:        ['Home Electronics'],
      beauty:      ['Beauty Tech'],
      hair:        ['Beauty Tech'],
      skin:        ['Beauty Tech'],
      dryer:       ['Beauty Tech'],
      dyson:       ['Beauty Tech'],
      gaming:      ['Accessories','Laptops'],
      budget:      [],
      best:        [],
      good:        [],
      cheap:       [],
      top:         [],
    };

    // Find matching categories
    let targetCategories = [];
    Object.entries(intentMap).forEach(([keyword, cats]) => {
      if (lower.includes(keyword)) {
        targetCategories = [...new Set([...targetCategories, ...cats])];
      }
    });

    // Quality/feature keywords
    const wantsBestRating = lower.includes('best') || lower.includes('top') || lower.includes('good');
    const wantsBudget     = lower.includes('budget') || lower.includes('cheap') || lower.includes('affordable');



    let scored = allProducts.map(p => {
      let score = 0;

      // Category match
      if (targetCategories.length === 0 || targetCategories.includes(p.category)) score += 10;

      // Price constraint
      if (p.price > maxPrice) return { ...p, score: -1 };

      // Budget preference
      if (wantsBudget && p.price < 200) score += 5;

      // Best rated
      if (wantsBestRating && p.rating >= 4) score += p.rating * 2;

      // Name/description keyword match
      const searchWords = lower.split(/\s+/).filter(w => w.length > 2 && !['best','good','the','for','with','and','under','over','below'].includes(w));
      searchWords.forEach(word => {
        if (p.name.toLowerCase().includes(word))        score += 8;
        if (p.category.toLowerCase().includes(word))    score += 5;
        if (p.description?.toLowerCase().includes(word)) score += 3;
      });

      // Discount bonus
      if (p.oldPrice) score += Math.round((1 - p.price/p.oldPrice) * 10);

      return { ...p, score };
    });

    return scored
      .filter(p => p.score > 0)
      .sort((a,b) => b.score - a.score)
      .slice(0, 8);
  };

  const generateAIMessage = (q, results) => {
    if (results.length === 0) return `I couldn't find products matching "${q}". Try different keywords!`;

    const priceMatch = q.match(/under\s*\$?(\d+)/i);
    const maxPrice   = priceMatch ? `under $${priceMatch[1]}` : '';
    const cheapest   = results[0]?.price;
    const categories = [...new Set(results.map(p => p.category))];

    return `I found ${results.length} products for "${q}"${maxPrice ? ` ${maxPrice}` : ''}. ${
      categories.length === 1
        ? `All from ${categories[0]}.`
        : `From ${categories.join(', ')}.`
    } Starting from $${cheapest}. Here are my top recommendations:`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">🤖</div>
          <h1 className="text-4xl font-bold mb-3">AI-Powered Search</h1>
          <p className="text-blue-100 text-lg mb-8">
            Describe what you need in plain English and our AI will find the perfect products for you
          </p>

          {/* Search Box */}
          <div className="relative">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. I need a laptop under $1000 for gaming..."
                  className="w-full px-5 py-4 rounded-xl text-gray-800 text-base focus:outline-none focus:ring-4 focus:ring-blue-300 pr-12"
                />
                {query && (
                  <button onClick={() => { setQuery(''); setSearched(false); setResults([]); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl">
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 active:scale-95 transition disabled:opacity-60 whitespace-nowrap flex items-center gap-2"
              >
                {loading ? (
                  <><span className="animate-spin">⚙️</span> Searching...</>
                ) : (
                  <><span>🔍</span> Search AI</>
                )}
              </button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mt-6">
            <p className="text-blue-200 text-sm mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map(s => (
                <button key={s}
                  onClick={() => { setQuery(s); handleSearch(s); }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-xs px-3 py-1.5 rounded-full transition border border-white border-opacity-30"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Search History */}
        {history.length > 0 && !searched && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500 mb-2">Recent Searches:</p>
            <div className="flex flex-wrap gap-2">
              {history.map(h => (
                <button key={h}
                  onClick={() => { setQuery(h); handleSearch(h); }}
                  className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-600 transition">
                  🕐 {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-4 animate-pulse">
                🤖
              </div>
              <p className="text-gray-700 font-semibold text-lg">AI is analyzing your request...</p>
              <p className="text-gray-400 text-sm mt-2">Finding the best products for you</p>
              <div className="flex gap-1.5 mt-4">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Message + Results */}
        {!loading && searched && (
          <>
            {/* AI Response message */}
            {aiMessage && (
              <div className="bg-white rounded-2xl shadow p-5 mb-6 flex gap-4 border-l-4 border-blue-600">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  🤖
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm mb-1">ShopZone AI</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{aiMessage}</p>
                </div>
              </div>
            )}

            {/* No results */}
            {results.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🤔</p>
                <p className="text-xl font-semibold text-gray-700 mb-2">No matches found</p>
                <p className="text-gray-400 mb-4">Try describing what you need differently</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.slice(0,4).map(s => (
                    <button key={s} onClick={() => { setQuery(s); handleSearch(s); }}
                      className="bg-blue-50 text-blue-600 text-sm px-4 py-2 rounded-xl hover:bg-blue-100 transition">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-800">
                    🎯 {results.length} Recommended Products
                  </h2>
                  <Link to="/products" className="text-blue-600 text-sm hover:underline">
                    Browse All →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {results.map(product => {
                    const id       = product.id || product._id;
                    const wishlisted = isWishlisted(id);
                    const discount = product.oldPrice
                      ? Math.round((1 - product.price/product.oldPrice)*100)
                      : 0;

                    return (
                      <div key={id} className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
                        <div className="relative overflow-hidden">
                          <Link to={`/product/${id}`}>
                            <img src={product.image} alt={product.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
                          </Link>
                          {product.badge && (
                            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                              {product.badge}
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              -{discount}%
                            </span>
                          )}
                          <button onClick={() => toggleWishlist(product)}
                            className={`absolute bottom-2 right-2 w-8 h-8 rounded-full shadow flex items-center justify-center transition ${
                              wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'
                            }`}>
                            ❤️
                          </button>
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                          <p className="text-xs text-blue-500 font-medium mb-1">{product.category}</p>
                          <Link to={`/product/${id}`}>
                            <h3 className="font-semibold text-gray-800 text-sm mb-2 hover:text-blue-600 transition line-clamp-2 flex-1">
                              {product.name}
                            </h3>
                          </Link>
                          <StarRating rating={product.rating} />
                          <div className="flex items-center gap-2 mt-2 mb-3">
                            <span className="text-blue-600 font-bold">${product.price}</span>
                            {product.oldPrice && (
                              <span className="text-gray-400 line-through text-xs">${product.oldPrice}</span>
                            )}
                          </div>
                          <div className="flex gap-2 mt-auto">
                            <button onClick={() => addToCart(product)}
                              className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition text-sm">
                              🛒 Add to Cart
                            </button>
                            <Link to={`/product/${id}`}
                              className="px-3 py-2 border border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition text-sm">
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && !searched && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💡</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">How AI Search Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-8">
              {[
                { icon: '💬', title: 'Describe naturally', desc: 'Type what you need in plain English like you\'re talking to a friend' },
                { icon: '🧠', title: 'AI understands', desc: 'Our AI analyzes your intent, budget, and requirements automatically' },
                { icon: '🎯', title: 'Get matches', desc: 'Receive personalized product recommendations ranked by relevance' },
              ].map(s => (
                <div key={s.title} className="bg-white rounded-2xl shadow p-6 text-center">
                  <div className="text-4xl mb-3">{s.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AISearch;
