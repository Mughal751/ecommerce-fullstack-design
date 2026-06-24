import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

function Cart() {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState('');

  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const total = cartTotal - discount + shipping;

  const handleVoucher = () => {
    if (voucher.toUpperCase() === 'SHOPZONE20') {
      const disc = cartTotal * 0.2;
      setDiscount(disc);
      setVoucherMsg(`✅ 20% discount applied! You save $${disc.toFixed(2)}`);
    } else if (voucher.toUpperCase() === 'SAVE10') {
      const disc = cartTotal * 0.1;
      setDiscount(disc);
      setVoucherMsg(`✅ 10% discount applied! You save $${disc.toFixed(2)}`);
    } else {
      setDiscount(0);
      setVoucherMsg('❌ Invalid voucher code');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some amazing products to get started!</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition font-semibold"
        >
          Continue Shopping →
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart 🛒</h1>
        <p className="text-gray-400 text-sm mb-8">
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
        </p>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow p-5 flex gap-5 items-center">

                {/* Image */}
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl flex-shrink-0 hover:opacity-80 transition"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition truncate">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-blue-600 font-bold mt-1">${item.price}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold text-lg flex items-center justify-center transition"
                  >−</button>
                  <span className="font-bold w-7 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold text-lg flex items-center justify-center transition"
                  >+</button>
                </div>

                {/* Item total */}
                <div className="w-20 text-right flex-shrink-0">
                  <p className="font-bold text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-300 hover:text-red-500 transition text-xl flex-shrink-0 ml-1"
                  title="Remove"
                >✕</button>
              </div>
            ))}

            <Link to="/products" className="text-blue-600 hover:underline text-sm mt-1">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-36">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-500' : ''}`}>
                    {shipping === 0 ? 'Free 🎉' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Add ${(100 - cartTotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="font-semibold text-red-500">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Voucher input */}
              <div className="mt-4 mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Voucher code"
                    value={voucher}
                    onChange={e => setVoucher(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={handleVoucher}
                    className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition font-semibold"
                  >
                    Apply
                  </button>
                </div>
                {voucherMsg && (
                  <p className={`text-xs mt-2 ${discount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {voucherMsg}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Try: <strong>SHOPZONE20</strong> for 20% off
                </p>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="mt-5 w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 active:scale-95 transition font-bold text-base"
              >
                Proceed to Checkout →
              </button>

              {/* Payment icons */}
              <div className="flex justify-center gap-4 mt-4 text-gray-400 text-xs">
                <span>💳 Visa</span>
                <span>💳 Mastercard</span>
                <span>🅿️ PayPal</span>
                <span>💵 COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;