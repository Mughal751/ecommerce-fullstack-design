import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import API from '../api';
import { allProducts } from '../products';

function Navbar() {
  const { cartCount } = useCart();
  const { user } = useAuth();
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleAISearch = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setShowResults(false);
    try {
      const { data } = await API.post('/ai/search', {
        query: aiQuery,
        products: allProducts.map(p => ({
          id: p.id, name: p.name, category: p.category,
          price: p.price, rating: p.rating, description: p.description,
        })),
      });
      const matched = allProducts.filter(p =>
        data.matches.some(matchId =>
          String(matchId) === String(p.id) ||
          String(matchId) === String(p._id)
        )
      );
      if (matched.length > 0) {
        setAiResults(matched);
        setShowResults(true);
      } else {
        // Fallback to keyword search
        navigate(`/products?search=${encodeURIComponent(aiQuery.trim())}`);
      }
    } catch (err) {
      console.error(err);
      navigate(`/products?search=${encodeURIComponent(aiQuery.trim())}`);
    } finally {
      setAiLoading(false);
    }
  };
  return (
    <header className="sticky top-0 z-50">

      {/* Top announcement bar */}
      <div className="bg-blue-700 text-white text-xs py-1.5 px-6 flex justify-between items-center">
        <span>🎉 Free shipping on orders over $100 | Use code <strong>SHOPZONE20</strong> for 20% off!</span>
        <div className="flex gap-3 items-center">
          {user ? (
            <span className="font-semibold">👋 {user.name}</span>
          ) : (
            <div className="flex gap-2 items-center">
              <Link to="/login" className="bg-white text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-50 transition">
                Login
              </Link>
              <Link to="/register" className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-yellow-300 transition">
                Register Free 🎉
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow-md px-6 py-3 flex flex-col md:flex-row items-center gap-3">
        <Link to="/" className="text-2xl font-bold text-blue-600 whitespace-nowrap">🛒 ShopZone</Link>

        {/* AI Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <form onSubmit={handleAISearch} className="flex">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 text-lg">✨</span>
              <input
                type="text"
                value={aiQuery}
                onChange={e => { setAiQuery(e.target.value); setShowResults(false); }}
                placeholder='Try: "laptop under $1500" or "best camera for travel"'
                className="w-full border border-gray-300 rounded-l-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={aiLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-r-xl hover:opacity-90 text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
            >
              {aiLoading ? (
                <>⏳ Searching...</>
              ) : (
                <>✨ AI Search</>
              )}
            </button>
          </form>

          {/* AI Results Dropdown */}
          {showResults && aiResults && (
            <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 mt-2 z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b bg-purple-50 rounded-t-xl">
                <p className="text-purple-700 text-sm font-semibold">
                  ✨ AI found {aiResults.length} products for "{aiQuery}"
                </p>
              </div>
              {aiResults.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">No matching products found</div>
              ) : (
                <div className="p-2">
                  {aiResults.slice(0, 6).map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => setShowResults(false)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
                    >
                      <img src={product.image} alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{product.name}</p>
                        <p className="text-gray-400 text-xs">{product.category}</p>
                      </div>
                      <p className="text-blue-600 font-bold text-sm flex-shrink-0">${product.price}</p>
                    </Link>
                  ))}
                  {aiResults.length > 6 && (
                    <button
                      onClick={() => {
                        setShowResults(false);
                        navigate(`/products?search=${encodeURIComponent(aiQuery)}`);
                      }}
                      className="w-full text-center text-blue-600 text-sm py-2 hover:bg-blue-50 rounded-lg transition font-semibold"
                    >
                      View all {aiResults.length} results →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 text-gray-700 text-sm font-medium">
          <Link to="/" className="hover:text-blue-600 hidden md:block">Home</Link>
          <Link to="/products" className="hover:text-blue-600 hidden md:block">Products</Link>
          <Link to="/deals" className="hover:text-red-500 text-red-500 font-bold hidden md:block">🔥 Deals</Link>

          {/* Cart */}
          <Link to="/cart" className="relative hover:text-blue-600 flex items-center gap-1">
            <span className="text-2xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* User Profile */}
          {user ? (
            <Link to="/profile"
              className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition hidden md:flex">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-blue-600 font-semibold text-sm">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link to="/login"
                className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition text-sm">
                Login
              </Link>
              <Link to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition text-sm">
                Register 🎉
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;