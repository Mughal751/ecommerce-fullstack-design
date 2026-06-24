import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { allProducts } from '../products';
import { ProductCard, StarRating } from '../components/ProductCard';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import ProductReviews from '../components/ProductReviews';

function ProductDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { addToCart }                     = useCart();
  const { isWishlisted, toggleWishlist }  = useWishlist();

  const product    = allProducts.find(p => p.id === parseInt(id) || p._id === id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded]       = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-xl font-semibold text-gray-700 mb-4">Product not found</p>
        <Link to="/products" className="text-blue-600 hover:underline">← Back to Products</Link>
      </div>
    );
  }

  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
  const related  = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const wishlisted = isWishlisted(product.id);

  // Multiple images (use same image with slight variation for demo)
  const images = [product.image, product.image, product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6 flex flex-wrap gap-1 items-center">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-600 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-10 mb-10">

          {/* Image Gallery */}
          <div className="w-full md:w-2/5 flex-shrink-0">
            <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-3">
              <img src={images[activeImg]} alt={product.name}
                className="w-full h-96 object-cover" />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-semibold">
                  {product.badge}
                </span>
              )}
              <span className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                -{discount}%
              </span>
            </div>
            {/* Thumbnail row */}
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                    activeImg === i ? 'border-blue-600' : 'border-gray-200 hover:border-gray-400'
                  }`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <p className="text-blue-600 text-sm font-semibold mb-1">{product.category}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={product.rating} />
              <span className="text-gray-400 text-sm">({product.rating}/5)</span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-400 text-sm">{product.stock} in stock</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-4xl font-bold text-blue-600">${product.price}</span>
              <span className="text-gray-400 line-through text-xl">${product.oldPrice}</span>
              <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-semibold">
                Save ${(product.oldPrice - product.price).toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <p className={`font-semibold text-sm ${product.stock > 5 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                {product.stock > 5 ? `In Stock (${product.stock} available)` : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700 font-semibold text-sm">Qty:</span>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-2 py-1">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 font-bold text-lg transition">
                  −
                </button>
                <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q+1))}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 font-bold text-lg transition">
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap mb-5">
              <button onClick={handleAddToCart}
                className={`flex-1 min-w-[140px] py-3.5 rounded-xl font-bold text-base transition active:scale-95 ${
                  added ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                {added ? '✓ Added!' : 'Add to Cart 🛒'}
              </button>
              <button onClick={handleBuyNow}
                className="flex-1 min-w-[140px] border-2 border-blue-600 text-blue-600 py-3.5 rounded-xl hover:bg-blue-50 active:scale-95 transition font-bold text-base">
                Buy Now ⚡
              </button>
              <button onClick={() => toggleWishlist(product)}
                className={`px-4 py-3.5 rounded-xl border-2 transition font-bold active:scale-95 ${
                  wishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
                }`}
                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
                ❤️
              </button>
              <button onClick={handleShare}
                className="px-4 py-3.5 rounded-xl border-2 border-gray-200 text-gray-400 hover:border-gray-400 transition active:scale-95"
                title="Share product">
                🔗
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-5 border-t border-gray-100">
              {[
                { icon: '🚚', text: 'Free Delivery over $100' },
                { icon: '🔄', text: '30-day Returns'          },
                { icon: '🔒', text: 'Secure Checkout'         },
                { icon: '✅', text: 'Genuine Product'         },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{b.icon}</span><span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-10">
          <ProductReviews productId={product._id || product.id?.toString()} />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
