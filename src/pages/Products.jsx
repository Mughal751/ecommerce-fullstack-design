import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { allProducts, categories } from '../products';
import { ProductCard } from '../components/ProductCard';

const sortOptions = [
  { value: 'default',    label: 'Featured'          },
  { value: 'price-asc',  label: 'Price: Low → High'  },
  { value: 'price-desc', label: 'Price: High → Low'  },
  { value: 'rating',     label: 'Top Rated'           },
  { value: 'discount',   label: 'Biggest Discount'    },
  { value: 'newest',     label: 'Newest First'        },
];

const BRANDS = ['All Brands','Apple','Samsung','Sony','DJI','Dyson','Bose','Logitech','Dell','ASUS','Google','LG','Philips','Theragun','Braun','Oral-B'];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort]             = useState('default');
  const [priceRange, setPriceRange] = useState(5000);
  const [brand, setBrand]           = useState('All Brands');
  const [minRating, setMinRating]   = useState(0);

  const urlCategory = searchParams.get('category') || 'All';
  const urlSearch   = searchParams.get('search')   || '';

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [search, setSearch]                     = useState(urlSearch);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') params.delete('category');
    else params.set('category', cat);
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search.trim()) params.set('search', search.trim());
    else params.delete('search');
    setSearchParams(params);
  };

  const clearFilters = () => {
    handleCategoryClick('All');
    setSearch('');
    setSort('default');
    setPriceRange(5000);
    setBrand('All Brands');
    setMinRating(0);
  };

  let filtered = allProducts.filter(p => {
    const matchCat    = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.category.toLowerCase().includes(search.toLowerCase());
    const matchPrice  = p.price <= priceRange;
    const matchBrand  = brand === 'All Brands' || p.name.toLowerCase().includes(brand.toLowerCase());
    const matchRating = p.rating >= minRating;
    return matchCat && matchSearch && matchPrice && matchBrand && matchRating;
  });

  if (sort === 'price-asc')  filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === 'price-desc') filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === 'rating')     filtered = [...filtered].sort((a,b) => b.rating - a.rating);
  if (sort === 'discount')   filtered = [...filtered].sort((a,b) =>
    (b.oldPrice-b.price)/b.oldPrice - (a.oldPrice-a.price)/a.oldPrice);
  if (sort === 'newest')     filtered = [...filtered].reverse();

  const activeFilters = [
    selectedCategory !== 'All',
    search,
    priceRange < 5000,
    brand !== 'All Brands',
    minRating > 0,
  ].filter(Boolean).length;

  return (
    <div className="flex gap-0 md:gap-6 p-4 md:p-6 min-h-screen bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="hidden md:block w-56 flex-shrink-0">
        <div className="bg-white rounded-xl shadow sticky top-36 max-h-[calc(100vh-10rem)] flex flex-col overflow-hidden">

          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Filters</h2>
            {activeFilters > 0 && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:underline font-semibold">
                Clear ({activeFilters})
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">

            {/* Categories */}
            <div className="p-3">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2 px-1">Category</p>
              {categories.map(cat => (
                <button key={cat.name} onClick={() => handleCategoryClick(cat.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between mb-0.5 ${
                    selectedCategory === cat.name
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  <span>{cat.name}</span>
                  <span className="text-xs opacity-60">
                    {allProducts.filter(p => cat.name === 'All' || p.category === cat.name).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Price Range */}
            <div className="p-3 border-t">
              <p className="text-xs font-bold text-gray-500 uppercase mb-3">Max Price</p>
              <input type="range" min={0} max={5000} step={50} value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span className="font-bold text-blue-600">${priceRange.toLocaleString()}</span>
                <span>$5,000</span>
              </div>
            </div>

            {/* Brand */}
            <div className="p-3 border-t">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Brand</p>
              <select value={brand} onChange={e => setBrand(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                {BRANDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>

            {/* Min Rating */}
            <div className="p-3 border-t">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Min Rating</p>
              <div className="flex flex-col gap-1.5">
                {[0,3,4,5].map(r => (
                  <button key={r} onClick={() => setMinRating(r)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                      minRating === r ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}>
                    {r === 0 ? 'All Ratings' : (
                      <>
                        {Array(r).fill('★').join('')}
                        <span className="text-xs opacity-75">& up</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 min-w-0">

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-1">
            <input type="text" placeholder="Search products..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-l-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
            <button type="submit"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-r-xl hover:bg-blue-700 text-sm font-semibold">
              Search
            </button>
          </form>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
            {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Mobile category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 md:hidden scrollbar-hide">
          {categories.map(cat => (
            <button key={cat.name} onClick={() => handleCategoryClick(cat.name)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 text-sm">
            <span className="font-bold text-gray-800">{filtered.length}</span> products
            {selectedCategory !== 'All' && <span> in <span className="text-blue-600 font-semibold">{selectedCategory}</span></span>}
            {search && <span> for "<span className="text-blue-600">{search}</span>"</span>}
          </p>
          {activeFilters > 0 && (
            <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">
              ✕ Clear all filters ({activeFilters})
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-gray-700 mb-2">No products found</p>
            <p className="text-gray-400 text-sm mb-4">Try different filters</p>
            <button onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
