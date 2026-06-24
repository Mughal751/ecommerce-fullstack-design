const express = require('express');
const router = express.Router();

router.post('/search', async (req, res) => {
  try {
    const { query, products } = req.body;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    const q = query.toLowerCase();

    // Extract price range from query
    const underMatch = q.match(/under\s*\$?(\d+)/);
    const overMatch  = q.match(/over\s*\$?(\d+)/);
    const maxPrice   = underMatch ? parseFloat(underMatch[1]) : null;
    const minPrice   = overMatch  ? parseFloat(overMatch[1])  : null;

    // Category keywords
    const categoryMap = {
      'phone': 'Phones', 'mobile': 'Phones', 'smartphone': 'Phones', 'iphone': 'Phones', 'samsung': 'Phones',
      'laptop': 'Laptops', 'macbook': 'Laptops', 'notebook': 'Laptops', 'computer': 'Laptops',
      'tablet': 'Tablets', 'ipad': 'Tablets',
      'camera': 'Cameras', 'dslr': 'Cameras', 'mirrorless': 'Cameras',
      'watch': 'Watches', 'smartwatch': 'Watches',
      'headphone': 'Headphones', 'earphone': 'Headphones', 'earbuds': 'Headphones', 'airpods': 'Headphones',
      'drone': 'Drones',
      'charger': 'Accessories', 'cable': 'Accessories', 'keyboard': 'Accessories', 'mouse': 'Accessories',
      'tv': 'Home Electronics', 'speaker': 'Home Electronics', 'smart home': 'Home Electronics',
      'hair': 'Beauty Tech', 'beauty': 'Beauty Tech', 'dyson': 'Beauty Tech',
    };

    // Find matching category
    let matchedCategory = null;
    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (q.includes(keyword)) {
        matchedCategory = category;
        break;
      }
    }

    // Rating keywords
    const wantsBest = q.includes('best') || q.includes('top') || q.includes('highest rated');
    const wantsCheap = q.includes('cheap') || q.includes('budget') || q.includes('affordable');

    // Filter products
    let matched = products.filter(p => {
      // Price filter
      if (maxPrice && p.price > maxPrice) return false;
      if (minPrice && p.price < minPrice) return false;

      // Category filter
      if (matchedCategory && p.category !== matchedCategory) return false;

      // Name/description keyword match
      const productText = `${p.name} ${p.category} ${p.description || ''}`.toLowerCase();
      const words = q.split(' ').filter(w =>
        w.length > 2 &&
        !['the', 'and', 'for', 'with', 'best', 'top', 'good', 'cheap', 'budget',
          'under', 'over', 'need', 'want', 'find', 'show', 'give', 'get'].includes(w)
      );

      const hasMatch = words.some(word => productText.includes(word));
      if (!matchedCategory && !hasMatch) return false;

      return true;
    });

    // If no matches found, return top rated products in any matching category
    if (matched.length === 0 && matchedCategory) {
      matched = products.filter(p => p.category === matchedCategory);
    }

    // Sort by rating if user wants best
    if (wantsBest) {
      matched = matched.sort((a, b) => b.rating - a.rating);
    }

    // Sort by price if user wants cheap
    if (wantsCheap) {
      matched = matched.sort((a, b) => a.price - b.price);
    }

    // Return matched IDs
    res.json({ matches: matched.map(p => p.id) });

  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;