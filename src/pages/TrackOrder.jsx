import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { getMyOrders } from '../api';

const steps = [
  { key: 'Pending',    label: 'Order Received',    icon: '📋', desc: 'Your order has been placed successfully' },
  { key: 'Processing', label: 'Processing',         icon: '⚙️', desc: 'We are preparing your order'            },
  { key: 'Shipped',    label: 'Shipped',            icon: '🚚', desc: 'Your order is on its way'               },
  { key: 'Delivered',  label: 'Delivered',          icon: '✅', desc: 'Your order has been delivered'          },
];

function TrackOrder() {
  const { user } = useAuth();
  const [trackingId, setTrackingId]   = useState('');
  const [order, setOrder]             = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) { setError('Please enter a tracking ID'); return; }
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const { data } = await getMyOrders();
      const found = data.find(o =>
        o.trackingId?.toLowerCase() === trackingId.trim().toLowerCase()
      );
      if (found) setOrder(found);
      else setError('No order found with this tracking ID. Please check and try again.');
    } catch (err) {
      setError('Failed to fetch order. Make sure you are logged in.');
    } finally { setLoading(false); }
  };

  const currentStep = order ? steps.findIndex(s => s.key === order.status) : -1;
  const isCancelled = order?.status === 'Cancelled';

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔍</div>
          <h1 className="text-3xl font-bold text-gray-800">Track Your Order</h1>
          <p className="text-gray-400 mt-2">Enter your tracking ID to see the live status of your order</p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleTrack} className="bg-white rounded-2xl shadow p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tracking ID
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={trackingId}
              onChange={e => setTrackingId(e.target.value.toUpperCase())}
              placeholder="e.g. SZ-ABC123XY"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition disabled:opacity-60"
            >
              {loading ? '⏳' : 'Track'}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
              <span>❌</span> {error}
            </p>
          )}
          {!user && (
            <p className="text-yellow-600 text-xs mt-3 bg-yellow-50 px-3 py-2 rounded-lg">
              ⚠️ You need to be logged in to track your orders
            </p>
          )}
        </form>

        {/* Result */}
        {order && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">

            {/* Order Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <p className="text-blue-100 text-xs mb-1">TRACKING ID</p>
                  <p className="font-mono font-bold text-2xl">{order.trackingId}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-xs mb-1">ORDER DATE</p>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex gap-6 mt-4 flex-wrap">
                <div>
                  <p className="text-blue-100 text-xs">PAYMENT</p>
                  <p className="font-semibold text-sm">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs">TOTAL</p>
                  <p className="font-semibold text-sm">${order.totalPrice?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs">ITEMS</p>
                  <p className="font-semibold text-sm">{order.orderItems?.length}</p>
                </div>
              </div>
            </div>

            <div className="p-6">

              {/* Cancelled */}
              {isCancelled ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center mb-6">
                  <p className="text-4xl mb-2">❌</p>
                  <p className="text-red-600 font-bold text-lg">Order Cancelled</p>
                  <p className="text-red-400 text-sm mt-1">This order has been cancelled</p>
                </div>
              ) : (
                /* Progress Tracker */
                <div className="mb-8">
                  <h3 className="font-bold text-gray-700 mb-6 text-sm uppercase tracking-wide">
                    Order Progress
                  </h3>
                  <div className="relative">
                    {/* Progress line */}
                    <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200 z-0" />
                    <div
                      className="absolute left-5 top-5 w-0.5 bg-blue-600 z-0 transition-all duration-700"
                      style={{
                        height: currentStep >= 0
                          ? `${(currentStep / (steps.length - 1)) * 100}%`
                          : '0%'
                      }}
                    />

                    <div className="space-y-6 relative z-10">
                      {steps.map((step, i) => {
                        const done    = i < currentStep;
                        const current = i === currentStep;
                        const future  = i > currentStep;
                        return (
                          <div key={step.key} className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 border-2 transition-all ${
                              done    ? 'bg-green-500 border-green-500 text-white' :
                              current ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100' :
                                        'bg-white border-gray-200 text-gray-300'
                            }`}>
                              {done ? '✓' : step.icon}
                            </div>
                            <div className="pt-1.5">
                              <p className={`font-semibold text-sm ${
                                done || current ? 'text-gray-800' : 'text-gray-400'
                              }`}>
                                {step.label}
                                {current && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                                    Current
                                  </span>
                                )}
                              </p>
                              <p className={`text-xs mt-0.5 ${
                                done || current ? 'text-gray-500' : 'text-gray-300'
                              }`}>
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm">
                <p className="font-bold text-gray-700 mb-2">📦 Delivery Address</p>
                <p className="text-gray-700 font-medium">{order.shippingAddress?.fullName}</p>
                <p className="text-gray-500">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                <p className="text-gray-500">{order.shippingAddress?.country}</p>
                <p className="text-gray-500">📞 {order.shippingAddress?.phone}</p>
              </div>

              {/* Items */}
              <div>
                <p className="font-bold text-gray-700 mb-3 text-sm">🛍️ Order Items</p>
                <div className="space-y-2">
                  {order.orderItems?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                      <img src={item.image} alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        onError={e => e.target.src = 'https://via.placeholder.com/48'} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-800 text-sm flex-shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackOrder;
