import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';

export function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= rating ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}>★</span>
      ))}
    </div>
  );
}

export function ProductCard({ product }) {
  const { addToCart }                   = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const id       = product.id || product._id;
  const wishlisted = isWishlisted(id);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <Link to={`/product/${id}`}>
      <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 p-4 cursor-pointer group h-full flex flex-col">
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
          />
          {product.badge && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              {product.badge}
            </span>
          )}
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full shadow flex items-center justify-center transition text-base ${
              wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'
            }`}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            ❤️
          </button>
          {/* Quick add */}
          <button
            onClick={handleAdd}
            className="absolute bottom-2 right-2 bg-white text-blue-600 text-xs px-3 py-1.5 rounded-full shadow-md font-semibold opacity-0 group-hover:opacity-100 transition hover:bg-blue-600 hover:text-white"
          >
            + Cart
          </button>
        </div>
        <p className="text-xs text-blue-500 font-medium mb-1">{product.category}</p>
        <h3 className="text-gray-800 font-semibold mb-1 text-sm leading-snug flex-1 line-clamp-2">{product.name}</h3>
        <StarRating rating={product.rating} />
        <div className="flex items-center gap-2 mt-2">
          <span className="text-blue-600 font-bold">${product.price}</span>
          {product.oldPrice && (
            <>
              <span className="text-gray-400 line-through text-xs">${product.oldPrice}</span>
              <span className="ml-auto text-xs text-green-600 font-medium">
                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
              </span>
            </>
          )}
        </div>
        <button
          onClick={handleAdd}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition text-sm font-semibold"
        >
          Add to Cart 🛒
        </button>
      </div>
    </Link>
  );
}
