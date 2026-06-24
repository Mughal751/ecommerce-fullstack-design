import { Link } from 'react-router-dom';
import { allProducts, dealProducts } from '../products';
import { useCountdown, CountdownDisplay } from '../hooks/useCountdown';
import { useCart } from '../CartContext';
import { StarRating } from '../components/ProductCard';

function Deals() {
  const { addToCart } = useCart();
  const timeLeft = useCountdown(23);

  const deals = dealProducts.map(d => ({
    ...allProducts.find(p => p.id === d.id),
    discount: d.discount,
  }));

  // Extra deals from all products with discount > 10%
  const extraDeals = allProducts
    .filter(p => !dealProducts.find(d => d.id === p.id))
    .map(p => ({
      ...p,
      discount: Math.round((1 - p.price / p.oldPrice) * 100),
    }))
    .filter(p => p.discount >= 12)
    .sort((a, b) => b.discount - a.discount);

  const allDeals = [...deals, ...extraDeals];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">🔥 Hot Deals &amp; Offers</h1>
            <p className="text-red-100 text-lg mb-2">
              Massive discounts on top electronics, beauty tech, and home gadgets
            </p>
            <p className="text-red-100 text-sm">Limited stock — once it's gone, it's gone!</p>
          </div>
          <div className="text-center">
            <p className="text-red-100 text-sm mb-2 font-semibold uppercase tracking-wide">Deals end in</p>
            <CountdownDisplay timeLeft={timeLeft} />
          </div>
        </div>
      </div>

      {/* Voucher strip */}
      <div className="bg-yellow-400 px-6 py-3 text-center">
        <p className="text-gray-900 font-semibold text-sm">
          🎁 Extra 20% off with code{' '}
          <span className="bg-gray-900 text-yellow-400 px-2 py-0.5 rounded font-bold mx-1">SHOPZONE20</span>
          — valid on all deals!
        </p>
      </div>

      {/* Deals grid */}
      <div className="px-6 py-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            All Deals <span className="text-gray-400 text-lg font-normal">({allDeals.length} items)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allDeals.map(deal => (
            <Link to={`/product/${deal.id}`} key={`deal-${deal.id}`}>
              <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">

                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    -{deal.discount}% OFF
                  </span>
                  {deal.badge && (
                    <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {deal.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs text-blue-500 font-medium mb-1">{deal.category}</p>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm leading-snug flex-1">{deal.name}</h3>
                  <StarRating rating={deal.rating} />

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xl font-bold text-red-600">${deal.price}</span>
                    <span className="text-gray-400 line-through text-sm">${deal.oldPrice}</span>
                    <span className="ml-auto text-green-600 text-xs font-bold">
                      Save ${(deal.oldPrice - deal.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Stock bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Selling fast</span>
                      <span>72% claimed</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-1.5">
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>

                  <button
                    onClick={e => { e.preventDefault(); addToCart(deal); }}
                    className="mt-4 w-full bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 active:scale-95 transition text-sm font-bold"
                  >
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Deals;
