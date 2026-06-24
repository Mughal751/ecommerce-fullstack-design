import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../WishlistContext';
import { useCart } from '../CartContext';

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id || product._id);
    navigate('/cart');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Wishlist ❤️</h1>
            <p className="text-gray-400 text-sm">{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/products" className="text-blue-600 hover:underline text-sm">+ Add More</Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow">
            <div className="text-7xl mb-4">❤️</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-6">Save products you love to buy them later!</p>
            <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
              Browse Products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlist.map(product => (
              <div key={product.id || product._id} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group">
                <div className="relative overflow-hidden">
                  <Link to={`/product/${product.id || product._id}`}>
                    <img src={product.image} alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product.id || product._id)}
                    className="absolute top-3 right-3 bg-white text-red-500 w-9 h-9 rounded-full shadow flex items-center justify-center hover:bg-red-500 hover:text-white transition text-lg"
                    title="Remove from wishlist"
                  >
                    ❤️
                  </button>
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-blue-500 font-medium mb-1">{product.category}</p>
                  <Link to={`/product/${product.id || product._id}`}>
                    <h3 className="font-semibold text-gray-800 mb-2 hover:text-blue-600 transition line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-blue-600 font-bold text-lg">${product.price}</span>
                    {product.oldPrice && (
                      <span className="text-gray-400 line-through text-sm">${product.oldPrice}</span>
                    )}
                    {product.oldPrice && (
                      <span className="text-green-600 text-xs font-semibold ml-auto">
                        -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition text-sm"
                    >
                      🛒 Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id || product._id)}
                      className="px-3 py-2.5 border border-red-200 text-red-400 rounded-xl hover:bg-red-50 transition text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
