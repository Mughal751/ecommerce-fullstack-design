import { Link, useNavigate } from 'react-router-dom';
import { allProducts, dealProducts } from '../products';
import { ProductCard } from '../components/ProductCard';
import { useCountdown, CountdownDisplay } from '../hooks/useCountdown';
import { useCart } from '../CartContext';

const categoryCards = [
  { name: 'Phones',           icon: '📱' },
  { name: 'Laptops',          icon: '💻' },
  { name: 'Tablets',          icon: '📟' },
  { name: 'Cameras',          icon: '📷' },
  { name: 'Watches',          icon: '⌚' },
  { name: 'Headphones',       icon: '🎧' },
  { name: 'Drones',           icon: '🚁' },
  { name: 'Accessories',      icon: '🔌' },
  { name: 'Home Electronics', icon: '🏠' },
  { name: 'Beauty Tech',      icon: '✨' },
];

function Home() {
  const navigate   = useNavigate();
  const { addToCart } = useCart();
  const timeLeft   = useCountdown(23);

  const dealsWithData = dealProducts.map(d => {
    const product = allProducts.find(p => p.id === d.id);
    return { ...product, discount: d.discount };
  });

  const featured = allProducts.slice(0, 8);

  return (
    <div>

      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 sm:px-8 py-10 sm:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-lg text-center md:text-left">
          <span className="bg-blue-800 text-blue-200 text-xs px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
            New Arrivals 2026
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Latest Trending<br />
            <span className="text-yellow-400">Electronic Items</span>
          </h1>
          <p className="text-blue-100 mb-6 sm:mb-8 text-base sm:text-lg">
            Smartphones, laptops, beauty tech & more — all in one store.
          </p>
          <div className="flex gap-3 flex-wrap justify-center md:justify-start">
            <button onClick={() => navigate('/products')}
              className="bg-yellow-400 text-gray-900 font-bold px-6 sm:px-8 py-3 rounded-lg hover:bg-yellow-300 active:scale-95 transition text-sm sm:text-base">
              Shop Now →
            </button>
            <button onClick={() => navigate('/deals')}
              className="border-2 border-white text-white font-bold px-6 sm:px-8 py-3 rounded-lg hover:bg-white hover:text-blue-700 active:scale-95 transition text-sm sm:text-base">
              View Deals 🔥
            </button>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop"
          alt="Hero"
          className="w-48 sm:w-64 md:w-80 rounded-2xl shadow-2xl"
        />
      </div>

      {/* ── Stats Bar ── */}
      <div className="bg-white shadow px-4 sm:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        {[
          { label: 'Products',        value: '10,000+' },
          { label: 'Happy Customers', value: '50,000+' },
          { label: 'Brands',          value: '500+'    },
          { label: 'Categories',      value: '11'      },
        ].map(stat => (
          <div key={stat.label}>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{stat.value}</p>
            <p className="text-gray-500 text-xs sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── AI Search Banner ──
      <div className="mx-3 sm:mx-6 mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-white font-bold text-lg sm:text-xl mb-1">🤖 Try AI-Powered Search</p>
          <p className="text-purple-100 text-sm">Describe what you need — "laptop under $1000 for gaming"</p>
        </div>
        <button onClick={() => navigate('/ai-search')}
          className="bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 active:scale-95 transition whitespace-nowrap text-sm sm:text-base flex-shrink-0">
          Try AI Search →
        </button> */}
      {/* </div> */}

      {/* ── Shop by Category ── */}
      <div className="px-3 sm:px-6 py-8 sm:py-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Shop by Category</h2>
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-3">
          {categoryCards.map(cat => (
            <button key={cat.name} onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
              className="bg-white rounded-xl shadow p-2 sm:p-3 text-center hover:shadow-lg hover:bg-blue-50 active:scale-95 transition cursor-pointer flex flex-col items-center gap-1">
              <span className="text-xl sm:text-2xl">{cat.icon}</span>
              <p className="text-xs font-medium text-gray-700 leading-tight hidden sm:block">{cat.name}</p>
              <p className="text-xs font-medium text-gray-700 leading-tight sm:hidden">{cat.name.split(' ')[0]}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Deals Section ── */}
      <div className="px-3 sm:px-6 py-4 sm:py-6 bg-white mx-3 sm:mx-6 rounded-2xl shadow mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 sm:mb-6 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">🔥 Deals &amp; Offers</h2>
            <p className="text-gray-500 text-xs sm:text-sm">Limited time — grab them fast!</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <CountdownDisplay timeLeft={timeLeft} />
            <button onClick={() => navigate('/deals')}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 active:scale-95 transition text-sm font-semibold whitespace-nowrap w-full sm:w-auto text-center">
              View All →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {dealsWithData.map(deal => (
            <Link to={`/product/${deal.id}`} key={deal.id}>
              <div className="border border-gray-100 rounded-xl p-3 sm:p-4 hover:shadow-lg transition cursor-pointer relative group">
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold z-10">
                  -{deal.discount}%
                </span>
                <div className="overflow-hidden rounded-lg mb-2 sm:mb-3">
                  <img src={deal.image} alt={deal.name}
                    className="w-full h-28 sm:h-40 object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <h3 className="font-semibold text-gray-800 text-xs sm:text-sm mb-1 line-clamp-2">{deal.name}</h3>
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <span className="text-blue-600 font-bold text-sm sm:text-base">${deal.price}</span>
                  <span className="text-gray-400 line-through text-xs">${deal.oldPrice}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-1.5 mb-1">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '72%' }} />
                </div>
                <p className="text-xs text-gray-400">72% claimed</p>
                <button onClick={e => { e.preventDefault(); addToCart(deal); }}
                  className="mt-2 sm:mt-3 w-full bg-blue-600 text-white py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition text-xs sm:text-sm font-semibold">
                  Add to Cart
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Featured Products ── */}
      <div className="px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Featured Products</h2>
          <button onClick={() => navigate('/products')} className="text-blue-600 hover:underline text-sm">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* ── Beauty & Wellness Tech ── */}
      <div className="px-3 sm:px-6 py-6 sm:py-8 bg-pink-50">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">✨ Beauty &amp; Wellness Tech</h2>
            <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">Smart devices for skincare, hair, and wellness</p>
          </div>
          <button onClick={() => navigate('/products?category=Beauty+Tech')}
            className="text-pink-600 hover:underline text-sm font-semibold whitespace-nowrap">
            Shop →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {allProducts.filter(p => p.category === 'Beauty Tech').slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* ── Home Electronics ── */}
      <div className="px-3 sm:px-6 py-6 sm:py-10">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">🏠 Home Electronics</h2>
            <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">Smart home, TVs, audio, and more</p>
          </div>
          <button onClick={() => navigate('/products?category=Home+Electronics')}
            className="text-blue-600 hover:underline text-sm font-semibold whitespace-nowrap">
            Shop →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {allProducts.filter(p => p.category === 'Home Electronics').slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* ── Voucher Banner ── */}
      <div className="mx-3 sm:mx-6 mb-8 sm:mb-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">🎁 Get 20% Off!</h2>
          <p className="text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
            Use code{' '}
            <span className="font-bold bg-white px-2 sm:px-3 py-1 rounded-lg text-orange-600">SHOPZONE20</span>
            {' '}at checkout
          </p>
          <button onClick={() => navigate('/register')}
            className="bg-gray-900 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-700 active:scale-95 transition font-semibold text-sm sm:text-base">
            Sign Up &amp; Save
          </button>
        </div>
        <div className="text-6xl sm:text-8xl">🛍️</div>
      </div>

      {/* ── Services ── */}
      <div className="px-3 sm:px-6 py-6 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
        {[
          { icon: '🚚', title: 'Free Delivery',  desc: 'On orders over $100'       },
          { icon: '🔄', title: 'Easy Returns',    desc: '30-day return policy'      },
          { icon: '🔒', title: 'Secure Payment',  desc: '100% secure transactions'  },
          { icon: '🎧', title: '24/7 Support',    desc: 'Always here to help'       },
        ].map(s => (
          <div key={s.title} className="bg-white rounded-xl shadow p-3 sm:p-6 text-center hover:shadow-lg transition">
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">{s.icon}</div>
            <h3 className="font-bold text-gray-800 mb-1 text-xs sm:text-base">{s.title}</h3>
            <p className="text-gray-500 text-xs hidden sm:block">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;