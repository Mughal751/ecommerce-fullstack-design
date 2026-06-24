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
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const timeLeft = useCountdown(23);

  const dealsWithData = dealProducts.map(d => {
    const product = allProducts.find(p => p.id === d.id);
    return { ...product, discount: d.discount };
  });

  const featured = allProducts.slice(0, 8);

  return (
    <div>
      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-lg">
          <span className="bg-blue-800 text-blue-200 text-xs px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
            New Arrivals 2026
          </span>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Latest Trending<br />
            <span className="text-yellow-400">Electronic Items</span>
          </h1>
          <p className="text-blue-100 mb-8 text-lg">
            Smartphones, laptops, beauty tech & more — all in one store.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/products')}
              className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-300 active:scale-95 transition"
            >
              Shop Now →
            </button>
            <button
              onClick={() => navigate('/deals')}
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white hover:text-blue-700 active:scale-95 transition"
            >
              View Deals 🔥
            </button>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop"
          alt="Hero product"
          className="w-72 md:w-80 rounded-2xl shadow-2xl"
        />
      </div>

      {/* ── Stats Bar ── */}
      <div className="bg-white shadow px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          { label: 'Products',          value: '10,000+' },
          { label: 'Happy Customers',   value: '50,000+' },
          { label: 'Brands',            value: '500+'    },
          { label: 'Categories',        value: '11'      },
        ].map(stat => (
          <div key={stat.label}>
            <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Shop by Category ── */}
      <div className="px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {categoryCards.map(cat => (
            <button
              key={cat.name}
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
              className="bg-white rounded-xl shadow p-3 text-center hover:shadow-lg hover:bg-blue-50 hover:border-blue-300 border border-transparent active:scale-95 transition cursor-pointer flex flex-col items-center gap-1"
            >
              <span className="text-2xl">{cat.icon}</span>
              <p className="text-xs font-medium text-gray-700 leading-tight">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Deals & Offers (live countdown) ── */}
      <div className="px-6 py-6 bg-white mx-6 rounded-2xl shadow mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🔥 Deals &amp; Offers</h2>
            <p className="text-gray-500 text-sm">Limited time — grab them before they're gone!</p>
          </div>
          <div className="flex items-center gap-4">
            <CountdownDisplay timeLeft={timeLeft} />
            <button
              onClick={() => navigate('/deals')}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 active:scale-95 transition text-sm font-semibold whitespace-nowrap"
            >
              View All Deals →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {dealsWithData.map(deal => (
            <Link to={`/product/${deal.id}`} key={deal.id}>
              <div className="border border-gray-100 rounded-xl p-4 hover:shadow-lg transition cursor-pointer relative group">
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
                  -{deal.discount}%
                </span>
                <div className="overflow-hidden rounded-lg mb-3">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">{deal.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-600 font-bold">${deal.price}</span>
                  <span className="text-gray-400 line-through text-xs">${deal.oldPrice}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-1.5 mb-1">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '72%' }} />
                </div>
                <p className="text-xs text-gray-400">72% claimed</p>
                <button
                  onClick={e => { e.preventDefault(); addToCart(deal); }}
                  className="mt-3 w-full bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 active:scale-95 transition text-sm font-semibold"
                >
                  Add to Cart
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Featured Products ── */}
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <button onClick={() => navigate('/products')} className="text-blue-600 hover:underline text-sm">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* ── Beauty & Wellness Tech ── */}
      <div className="px-6 py-6 bg-pink-50 mx-0 mb-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">✨ Beauty &amp; Wellness Tech</h2>
            <p className="text-gray-500 text-sm">Smart devices for skincare, hair, and wellness</p>
          </div>
          <button
            onClick={() => navigate('/products?category=Beauty+Tech')}
            className="text-pink-600 hover:underline text-sm font-semibold"
          >
            Shop Beauty →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.filter(p => p.category === 'Beauty Tech').map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* ── Home Electronics ── */}
      <div className="px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🏠 Home Electronics</h2>
            <p className="text-gray-500 text-sm">Smart home, TVs, audio, and more</p>
          </div>
          <button
            onClick={() => navigate('/products?category=Home+Electronics')}
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            Shop Home →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.filter(p => p.category === 'Home Electronics').map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* ── Voucher Banner ── */}
      <div className="mx-6 mb-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">🎁 Get 20% Off Your First Order!</h2>
          <p className="text-gray-800 mb-4">
            Use code{' '}
            <span className="font-bold bg-white px-3 py-1 rounded-lg text-orange-600">SHOPZONE20</span>{' '}
            at checkout
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 active:scale-95 transition font-semibold"
          >
            Sign Up &amp; Save
          </button>
        </div>
        <div className="text-8xl">🛍️</div>
      </div>

      {/* ── Services ── */}
      <div className="px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {[
          { icon: '🚚', title: 'Free Delivery',    desc: 'On orders over $100'         },
          { icon: '🔄', title: 'Easy Returns',      desc: '30-day return policy'        },
          { icon: '🔒', title: 'Secure Payment',    desc: '100% secure transactions'   },
          { icon: '🎧', title: '24/7 Support',      desc: 'Always here to help'        },
        ].map(s => (
          <div key={s.title} className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-3">{s.icon}</div>
            <h3 className="font-bold text-gray-800 mb-1">{s.title}</h3>
            <p className="text-gray-500 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
