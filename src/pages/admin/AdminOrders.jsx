import { useState, useEffect } from 'react';
import API from '../../api';

const STATUSES = ['Pending','Processing','Shipped','Delivered','Cancelled'];

const statusColors = {
  Pending:    'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-purple-100 text-purple-700',
  Delivered:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-700',
};

function AdminOrders() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg]           = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      setOrders(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    setUpdating(true);
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      setMsg('✅ Order status updated!');
      fetchOrders();
      setSelected(prev => prev ? { ...prev, status } : null);
    } catch (e) {
      setMsg('❌ Update failed');
    } finally { setUpdating(false); }
  };

  const filtered = orders.filter(o => {
    const matchSearch = o.trackingId?.toLowerCase().includes(search.toLowerCase()) ||
                        o.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders.reduce((s, o) => s + o.totalPrice, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Orders Management</h2>
          <p className="text-gray-400 text-sm">{orders.length} total orders · Total Revenue: <strong className="text-green-600">${totalRevenue.toFixed(2)}</strong></p>
        </div>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-xl mb-4 text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg} <button onClick={() => setMsg('')} className="ml-2 opacity-50">✕</button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilterStatus(filterStatus === s ? 'All' : s)}
            className={`p-3 rounded-xl border-2 text-center transition ${filterStatus === s ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
            <p className={`text-lg font-bold ${statusColors[s]?.includes('yellow') ? 'text-yellow-600' : statusColors[s]?.includes('blue') ? 'text-blue-600' : statusColors[s]?.includes('purple') ? 'text-purple-600' : statusColors[s]?.includes('green') ? 'text-green-600' : 'text-red-600'}`}>
              {orders.filter(o => o.status === s).length}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{s}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input type="text" placeholder="Search by tracking ID or customer..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
          <option value="All">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500 text-xs uppercase">
                  <th className="px-5 py-4">Tracking ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Items</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-mono text-blue-600 font-bold text-xs">{order.trackingId}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{order.user?.name || 'Guest'}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{order.orderItems?.length} item(s)</td>
                    <td className="px-5 py-4 font-bold text-gray-800">${order.totalPrice}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{order.paymentMethod}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(order)}
                        className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100 transition">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No orders found</p>}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Order Details</h3>
                <p className="text-blue-600 font-mono text-sm">{selected.trackingId}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6">
              {/* Customer */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
                <p className="font-semibold text-gray-700 mb-2">👤 Customer</p>
                <p className="text-gray-600">{selected.user?.name}</p>
                <p className="text-gray-400">{selected.user?.email}</p>
              </div>
              {/* Address */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
                <p className="font-semibold text-gray-700 mb-2">📦 Shipping Address</p>
                <p className="text-gray-600">{selected.shippingAddress?.fullName}</p>
                <p className="text-gray-500">{selected.shippingAddress?.address}, {selected.shippingAddress?.city}</p>
                <p className="text-gray-500">📞 {selected.shippingAddress?.phone}</p>
              </div>
              {/* Items */}
              <div className="mb-4">
                <p className="font-semibold text-gray-700 mb-2 text-sm">🛍️ Order Items</p>
                {selected.orderItems?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity} × ${item.price}</p>
                    </div>
                    <p className="font-bold text-sm text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              {/* Total */}
              <div className="flex justify-between font-bold text-gray-800 border-t pt-3 mb-5">
                <span>Total</span>
                <span className="text-blue-600">${selected.totalPrice}</span>
              </div>
              {/* Update Status */}
              <div>
                <p className="font-semibold text-gray-700 mb-2 text-sm">Update Status</p>
                <div className="grid grid-cols-3 gap-2">
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => updateStatus(selected._id, s)} disabled={updating}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition active:scale-95 ${
                        selected.status === s
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
