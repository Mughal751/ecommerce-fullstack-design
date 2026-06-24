import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getMyOrders } from '../api';

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const statusColors = {
    Pending:    'bg-yellow-100 text-yellow-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped:    'bg-purple-100 text-purple-700',
    Delivered:  'bg-green-100 text-green-700',
    Cancelled:  'bg-red-100 text-red-700',
  };

  const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Order Detail View
  if (selectedOrder) {
    const stepIndex = statusSteps.indexOf(selectedOrder.status);
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-3xl mx-auto px-6">
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-blue-600 hover:underline text-sm mb-6 flex items-center gap-1"
          >
            ← Back to Orders
          </button>

          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-PK', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
              <span className={`mt-3 sm:mt-0 px-4 py-2 rounded-full text-sm font-semibold ${statusColors[selectedOrder.status]}`}>
                {selectedOrder.status}
              </span>
            </div>

            {/* Tracking ID */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Tracking ID</p>
                <p className="text-xl font-bold text-blue-600">{selectedOrder.trackingId}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(selectedOrder.trackingId)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Copy ID 📋
              </button>
            </div>

            {/* Order Progress */}
            {selectedOrder.status !== 'Cancelled' && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-4">Order Progress</h3>
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                  <div
                    className="absolute top-4 left-0 h-0.5 bg-blue-600 z-0 transition-all"
                    style={{ width: `${(stepIndex / (statusSteps.length - 1)) * 100}%` }}
                  />
                  {statusSteps.map((step, i) => (
                    <div key={step} className="flex flex-col items-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition ${
                        i <= stepIndex
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {i < stepIndex ? '✓' : i + 1}
                      </div>
                      <p className={`text-xs mt-2 font-medium ${i <= stepIndex ? 'text-blue-600' : 'text-gray-400'}`}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Items Ordered</h3>
              <div className="flex flex-col gap-3">
                {selectedOrder.orderItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping + Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-700 mb-2">📦 Shipping Address</h3>
                <p className="text-gray-600 text-sm">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-gray-600 text-sm">{selectedOrder.shippingAddress.address}</p>
                <p className="text-gray-600 text-sm">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}</p>
                <p className="text-gray-600 text-sm">📞 {selectedOrder.shippingAddress.phone}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-700 mb-2">💳 Payment Info</h3>
                <p className="text-gray-600 text-sm">Method: {selectedOrder.paymentMethod}</p>
                <p className="text-gray-600 text-sm">Status: {selectedOrder.isPaid ? '✅ Paid' : '⏳ Pending'}</p>
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Items Total</span>
                <span>${selectedOrder.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Shipping</span>
                <span className={selectedOrder.shippingPrice === 0 ? 'text-green-500' : ''}>
                  {selectedOrder.shippingPrice === 0 ? 'Free' : `$${selectedOrder.shippingPrice?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-800 border-t pt-2">
                <span>Total</span>
                <span className="text-blue-600">${selectedOrder.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Continue Shopping →
            </Link>
            <button
              onClick={() => setSelectedOrder(null)}
              className="border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              ← All Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Orders List View
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders 📦</h1>
        <p className="text-gray-400 text-sm mb-8">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-xl font-semibold text-gray-700 mb-2">No orders yet</p>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here!</p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700"
            >
              Shop Now →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tracking ID</p>
                    <p className="font-bold text-blue-600">{order.trackingId}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <p className="text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {order.orderItems.slice(0, 4).map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                  ))}
                  {order.orderItems.length > 4 && (
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm font-bold flex-shrink-0">
                      +{order.orderItems.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-xs">Total Amount</p>
                    <p className="font-bold text-gray-800 text-lg">${order.totalPrice?.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;