const Product = require('../models/Product');

// @POST /api/ai/search
// Pure server-side semantic search — no external API needed
const aiSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    const lower    = query.toLowerCase();
    const products = await Product.find({});

    // ── Extract price constraint ──
    const priceMatch = lower.match(/under\s*\$?(\d+)/i)
      || lower.match(/below\s*\$?(\d+)/i)
      || lower.match(/less than\s*\$?(\d+)/i)
      || lower.match(/max\s*\$?(\d+)/i)
      || lower.match(/budget.*?\$?(\d+)/i);
    const maxPrice = priceMatch ? parseInt(priceMatch[1]) : Infinity;

    // ── Extract min price ──
    const minPriceMatch = lower.match(/above\s*\$?(\d+)/i)
      || lower.match(/over\s*\$?(\d+)/i)
      || lower.match(/more than\s*\$?(\d+)/i);
    const minPrice = minPriceMatch ? parseInt(minPriceMatch[1]) : 0;

    // ── Intent → category mapping ──
    const intentMap = {
      laptop:       ['Laptops'],
      computer:     ['Laptops'],
      macbook:      ['Laptops'],
      notebook:     ['Laptops'],
      gaming:       ['Laptops', 'Accessories'],
      phone:        ['Phones'],
      smartphone:   ['Phones'],
      iphone:       ['Phones'],
      android:      ['Phones'],
      mobile:       ['Phones'],
      tablet:       ['Tablets'],
      ipad:         ['Tablets'],
      camera:       ['Cameras'],
      photo:        ['Cameras'],
      photography:  ['Cameras'],
      video:        ['Cameras'],
      watch:        ['Watches'],
      smartwatch:   ['Watches'],
      wearable:     ['Watches'],
      headphone:    ['Headphones'],
      earbud:       ['Headphones'],
      airpod:       ['Headphones'],
      earphone:     ['Headphones'],
      audio:        ['Headphones'],
      music:        ['Headphones'],
      noise:        ['Headphones'],
      drone:        ['Drones'],
      fly:          ['Drones'],
      aerial:       ['Drones'],
      keyboard:     ['Accessories'],
      mouse:        ['Accessories'],
      charger:      ['Accessories'],
      ssd:          ['Accessories'],
      storage:      ['Accessories'],
      tv:           ['Home Electronics'],
      television:   ['Home Electronics'],
      speaker:      ['Home Electronics'],
      smart:        ['Home Electronics'],
      home:         ['Home Electronics'],
      vacuum:       ['Home Electronics'],
      light:        ['Home Electronics'],
      beauty:       ['Beauty Tech'],
      hair:         ['Beauty Tech'],
      skin:         ['Beauty Tech'],
      dryer:        ['Beauty Tech'],
      dyson:        ['Beauty Tech'],
      massage:      ['Beauty Tech'],
      wellness:     ['Beauty Tech'],
      grooming:     ['Beauty Tech'],
    };

    // Find target categories from query
    let targetCategories = [];
    Object.entries(intentMap).forEach(([kw, cats]) => {
      if (lower.includes(kw)) {
        targetCategories = [...new Set([...targetCategories, ...cats])];
      }
    });

    // Feature preferences
    const wantsBest     = lower.includes('best') || lower.includes('top') || lower.includes('premium') || lower.includes('pro');
    const wantsBudget   = lower.includes('budget') || lower.includes('cheap') || lower.includes('affordable') || lower.includes('inexpensive');
    const wantsDiscount = lower.includes('deal') || lower.includes('discount') || lower.includes('sale') || lower.includes('offer');
    const wantsBattery  = lower.includes('battery');
    const wantsCamera   = lower.includes('camera') && targetCategories.includes('Phones');

    // Score each product
    const scored = products.map(p => {
      let score = 0;

      // Hard filter: price range
      if (p.price > maxPrice || p.price < minPrice) return { ...p, score: -1 };

      // Category match (strong signal)
      if (targetCategories.length === 0) {
        score += 5; // No category filter — all products eligible
      } else if (targetCategories.includes(p.category)) {
        score += 20;
      } else {
        return { ...p, score: -1 }; // Wrong category
      }

      // Rating score
      score += (p.rating || 0) * 3;

      // Best/premium preference
      if (wantsBest && p.rating >= 4.5) score += 10;
      if (wantsBest && p.badge === 'Best Seller') score += 8;
      if (wantsBest && p.badge === 'Pro') score += 6;

      // Budget preference
      if (wantsBudget) {
        const categoryAvg = products
          .filter(x => x.category === p.category)
          .reduce((s, x) => s + x.price, 0) /
          products.filter(x => x.category === p.category).length;
        if (p.price < categoryAvg) score += 8;
      }

      // Discount preference
      if (wantsDiscount && p.oldPrice) {
        const discountPct = ((p.oldPrice - p.price) / p.oldPrice) * 100;
        score += Math.round(discountPct / 5);
      }

      // Name keyword match
      const words = lower.split(/\s+/).filter(w =>
        w.length > 2 &&
        !['best','good','the','for','with','and','under','over','below','need','want','looking','find','show','give','some','any','please'].includes(w)
      );
      words.forEach(word => {
        if (p.name.toLowerCase().includes(word))          score += 10;
        if (p.category.toLowerCase().includes(word))      score += 6;
        if ((p.description || '').toLowerCase().includes(word)) score += 3;
      });

      // New badge bonus
      if (p.badge === 'New') score += 3;
      if (p.isFeatured)      score += 2;
      if (p.isDeal)          score += wantsDiscount ? 5 : 2;

      // Stock bonus
      if (p.stock > 10) score += 2;

      return { ...p, score };
    });

    const results = scored
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    // Build AI-style message
    let message = '';
    if (results.length === 0) {
      message = `I couldn't find products matching "${query}". Try searching for a specific category like laptops, phones, or headphones.`;
    } else {
      const cats     = [...new Set(results.map(p => p.category))];
      const minFound = Math.min(...results.map(p => p.price));
      const maxFound = Math.max(...results.map(p => p.price));
      const priceStr = maxPrice < Infinity ? ` under $${maxPrice}` : '';
      const budgetStr = wantsBudget ? ' (budget-friendly options prioritized)' : '';
      const bestStr   = wantsBest   ? ' (top-rated products first)'           : '';

      message = `I found ${results.length} product${results.length > 1 ? 's' : ''} for "${query}"${priceStr}${budgetStr}${bestStr}. ${
        cats.length === 1 ? `All from ${cats[0]}.` : `From: ${cats.join(', ')}.`
      } Price range: $${minFound} – $${maxFound}.`;
    }

    res.json({ message, products: results });
  } catch (err) {
    console.error('AI Search error:', err.message);
    res.status(500).json({ message: 'Search failed. Please try again.' });
  }
};

module.exports = { aiSearch };