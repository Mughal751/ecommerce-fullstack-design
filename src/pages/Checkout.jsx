import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { createOrder } from '../api';
import StripePayment from '../components/StripePayment';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    country: 'Pakistan',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [voucher, setVoucher] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState('');

  const shippingPrice = cartTotal >= 100 ? 0 : 9.99;
  const total = cartTotal - discount + shippingPrice;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-xl font-semibold text-gray-700">Please login to checkout</p>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
          Login →
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0 && !placedOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-5xl">🛒</p>
        <p className="text-xl font-semibold text-gray-700">Your cart is empty</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
          Shop Now →
        </Link>
      </div>
    );
  }

  const handleVoucher = () => {
    const code = voucher.trim().toUpperCase();
    if (code === '') {
      setVoucherMsg('❌ Please enter a voucher code');
      return;
    }
    if (code === 'SHOPZONE20') {
      const disc = parseFloat((cartTotal * 0.2).toFixed(2));
      setDiscount(disc);
      setVoucherMsg(`✅ 20% discount applied! You save $${disc.toFixed(2)}`);
    } else if (code === 'SAVE10') {
      const disc = parseFloat((cartTotal * 0.1).toFixed(2));
      setDiscount(disc);
      setVoucherMsg(`✅ 10% discount applied! You save $${disc.toFixed(2)}`);
    } else if (code === 'FLAT50') {
      setDiscount(50);
      setVoucherMsg(`✅ $50 flat discount applied!`);
    } else {
      setDiscount(0);
      setVoucherMsg('❌ Invalid code. Try: SHOPZONE20, SAVE10, or FLAT50');
    }
  };

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (paymentId = null) => {
    if (!shipping.fullName || !shipping.phone || !shipping.address || !shipping.city) {
      setError('Please fill all shipping fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product:  item._id || item.id,
          name:     item.name,
          image:    item.image,
          price:    item.price,
          quantity: item.quantity,
        })),
        shippingAddress: shipping,
        paymentMethod,
        itemsPrice:    parseFloat(cartTotal.toFixed(2)),
        shippingPrice: parseFloat(shippingPrice.toFixed(2)),
        totalPrice:    parseFloat(total.toFixed(2)),
        isPaid:        paymentId ? true : false,
        paidAt:        paymentId ? new Date() : null,
      };

      const { data } = await createOrder(orderData);
      setPlacedOrder(data);
      clearCart();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step Bar
  const StepBar = () => (
    <div className="flex items-center justify-center mb-8">
      {['Shipping', 'Payment', 'Confirmed'].map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            step > i ? 'bg-green-500 text-white' :
            step === i + 1 ? 'bg-blue-600 text-white' :
            'bg-gray-200 text-gray-400'
          }`}>
            {step > i ? '✓' : i + 1}
          </div>
          <span className={`mx-2 text-sm font-medium ${step === i + 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            {s}
          </span>
          {i < 2 && <div className={`w-12 h-0.5 mx-1 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center mb-6">
          <Link to="/" className="text-2xl font-bold text-blue-600">🛒 ShopZone</Link>
          <h1 className="text-xl font-semibold text-gray-700 mt-1">Secure Checkout</h1>
        </div>

        <StepBar />

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Side */}
          <div className="flex-1">

            {/* STEP 1 — Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">📦 Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                    <input type="text" name="fullName" value={shipping.fullName}
                      onChange={handleShippingChange} placeholder="Muhammad Saad"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number *</label>
                    <input type="tel" name="phone" value={shipping.phone}
                      onChange={handleShippingChange} placeholder="+92 300 1234567"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">City *</label>
                    <input type="text" name="city" value={shipping.city}
                      onChange={handleShippingChange} placeholder="Lahore"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Address *</label>
                    <textarea name="address" value={shipping.address}
                      onChange={handleShippingChange}
                      placeholder="House 123, Street 4, Block A"
                      rows={3}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Country</label>
                    <select name="country" value={shipping.country} onChange={handleShippingChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                      <option>Pakistan</option>
                      <option>UAE</option>
                      <option>Saudi Arabia</option>
                      <option>UK</option>
                      <option>USA</option>
                    </select>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
                <button
                  onClick={() => {
                    if (!shipping.fullName || !shipping.phone || !shipping.address || !shipping.city) {
                      setError('Please fill all required fields');
                      return;
                    }
                    setError('');
                    setStep(2);
                  }}
                  className="mt-6 w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">💳 Payment Method</h2>

                {/* Payment Options */}
                <div className="flex flex-col gap-3 mb-6">
                  {[
                    { id: 'Cash on Delivery', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                    { id: 'Card',             icon: '💳', label: 'Credit / Debit Card', desc: 'Visa, Mastercard via Stripe' },
                    { id: 'PayPal',           icon: '🅿️', label: 'PayPal', desc: 'Fast & secure PayPal payment' },
                  ].map(method => (
                    <label key={method.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                        paymentMethod === method.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <input type="radio" name="payment" value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="accent-blue-600 w-4 h-4" />
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{method.label}</p>
                        <p className="text-xs text-gray-400">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Stripe Card Form */}
                {paymentMethod === 'Card' && (
                  <div className="mb-6">
                    <Elements stripe={stripePromise}>
                      <StripePayment
                        amount={total}
                        onSuccess={(paymentId) => {
                          setError('');
                          handlePlaceOrder(paymentId);
                        }}
                        onError={(msg) => setError(msg)}
                      />
                    </Elements>
                  </div>
                )}

                {/* Shipping Summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
                  <p className="font-semibold text-gray-700 mb-2">📦 Delivering to:</p>
                  <p className="text-gray-600">{shipping.fullName}</p>
                  <p className="text-gray-600">{shipping.address}, {shipping.city}, {shipping.country}</p>
                  <p className="text-gray-600">📞 {shipping.phone}</p>
                  <button onClick={() => setStep(1)} className="text-blue-600 text-xs mt-2 hover:underline">
                    Edit address
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">❌ {error}</div>
                )}

                {/* Place Order Button — hidden for Card since Stripe has its own */}
                {paymentMethod !== 'Card' && (
                  <button
                    onClick={() => handlePlaceOrder()}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 active:scale-95 transition disabled:opacity-60"
                  >
                    {loading ? '⏳ Placing Order...' : `🛍️ Place Order — $${total.toFixed(2)}`}
                  </button>
                )}

                <div className="flex justify-center gap-4 mt-4 text-gray-400 text-xs">
                  <span>🔒 Secure checkout</span>
                  <span>✅ 30-day returns</span>
                  <span>🚚 Fast delivery</span>
                </div>
              </div>
            )}

            {/* STEP 3 — Confirmation */}
            {step === 3 && placedOrder && (
              <div className="bg-white rounded-2xl shadow p-8 text-center">
                <div className="text-7xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-500 mb-6">
                  Thank you <strong>{user.name}</strong>! A confirmation email has been sent to{' '}
                  <strong>{user.email}</strong>
                </p>
                <div className="bg-blue-50 rounded-xl p-6 mb-6 text-left">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Tracking ID</p>
                      <p className="font-bold text-blue-600 text-lg">{placedOrder.trackingId}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Payment</p>
                      <p className="font-semibold text-gray-800">{placedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Status</p>
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {placedOrder.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Total Paid</p>
                      <p className="font-bold text-gray-800">${placedOrder.totalPrice}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <p className="text-gray-400 text-xs mb-1">Delivering to</p>
                    <p className="text-gray-700 text-sm font-medium">{placedOrder.shippingAddress.fullName}</p>
                    <p className="text-gray-500 text-sm">{placedOrder.shippingAddress.address}, {placedOrder.shippingAddress.city}</p>
                    <p className="text-gray-500 text-sm">📞 {placedOrder.shippingAddress.phone}</p>
                  </div>
                </div>
                <div className="flex gap-4 flex-wrap justify-center">
                  <button onClick={() => navigate('/')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition">
                    Continue Shopping →
                  </button>
                  <button onClick={() => navigate('/orders')}
                    className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 active:scale-95 transition">
                    View My Orders
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side — Order Summary */}
          {step < 3 && (
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h3>

                {/* Items */}
                <div className="flex flex-col gap-3 mb-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Voucher */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Voucher code"
                      value={voucher}
                      onChange={e => setVoucher(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleVoucher()}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button onClick={handleVoucher}
                      className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition">
                      Apply
                    </button>
                  </div>
                  {voucherMsg && (
                    <p className={`text-xs ${discount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {voucherMsg}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Try: <strong>SHOPZONE20</strong> · <strong>SAVE10</strong> · <strong>FLAT50</strong>
                  </p>
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount Applied 🎉</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shippingPrice === 0 ? 'text-green-500 font-semibold' : ''}>
                      {shippingPrice === 0 ? 'Free 🎉' : `$${shippingPrice.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-800 border-t pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;