import { useState, useEffect } from 'react';
import API from '../../api';

const statusColors = {
  Pending:    'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-purple-100 text-purple-700',
  Delivered:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-700',
};

function AdminShipping() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('Pending');
  const [updating, setUpdating] = useState(null);
  const [msg, setMsg]         = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      setOrders(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const markShipped = async (id) => {
    setUpdating(id);
    try {
      await API.put(`/orders/${id}/status`, { status: 'Shipped' });
      setMsg('✅ Marked as Shipped!');
      fetchOrders();
    } catch (e) { setMsg('❌ Update failed'); }
    finally { setUpdating(null); setTimeout(() => setMsg(''), 2000); }
  };

  const markDelivered = async (id) => {
    setUpdating(id);
    try {
      await API.put(`/orders/${id}/status`, { status: 'Delivered' });
      setMsg('✅ Marked as Delivered!');
      fetchOrders();
    } catch (e) { setMsg('❌ Update failed'); }
    finally { setUpdating(null); setTimeout(() => setMsg(''), 2000); }
  };

  const filtered = orders.filter(o =>
    filter === 'All' || o.status === filter
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Shipping Management</h2>
        <p className="text-gray-400 text-sm">Track and manage order shipments</p>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-xl mb-4 text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg}
        </div>
      )}

      {/* Status filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['All','Pending','Processing','Shipped','Delivered'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition ${
              filter === s ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
            {s} ({s === 'All' ? orders.length : orders.filter(o=>o.status===s).length})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading shipments...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No orders with this status</div>
        ) : (
          filtered.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow p-5">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="font-mono font-bold text-blue-600">{order.trackingId}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">CUSTOMER</p>
                      <p className="font-medium text-gray-800">{order.user?.name}</p>
                      <p className="text-gray-500 text-xs">{order.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">DELIVER TO</p>
                      <p className="font-medium text-gray-800">{order.shippingAddress?.fullName}</p>
                      <p className="text-gray-500 text-xs">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                      <p className="text-gray-500 text-xs">📞 {order.shippingAddress?.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">ORDER VALUE</p>
                      <p className="font-bold text-gray-800">${order.totalPrice}</p>
                      <p className="text-xs text-gray-400">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">ITEMS</p>
                      <p className="text-gray-600">{order.orderItems?.length} item(s)</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0 justify-start">
                  {(order.status === 'Pending' || order.status === 'Processing') && (
                    <button onClick={() => markShipped(order._id)} disabled={updating === order._id}
                      className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-purple-700 active:scale-95 transition disabled:opacity-60">
                      📦 Mark Shipped
                    </button>
                  )}
                  {order.status === 'Shipped' && (
                    <button onClick={() => markDelivered(order._id)} disabled={updating === order._id}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 active:scale-95 transition disabled:opacity-60">
                      ✅ Mark Delivered
                    </button>
                  )}
                  {order.status === 'Delivered' && (
                    <span className="text-green-600 font-semibold text-sm">✅ Delivered</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminShipping;
