import { useState, useEffect } from 'react';
import API from '../../api';

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        // Get all orders and extract unique users
        const { data } = await API.get('/orders');
        const userMap = {};
        data.forEach(order => {
          if (order.user?._id) {
            if (!userMap[order.user._id]) {
              userMap[order.user._id] = {
                _id:      order.user._id,
                name:     order.user.name,
                email:    order.user.email,
                orders:   0,
                spent:    0,
                lastOrder: order.createdAt,
              };
            }
            userMap[order.user._id].orders += 1;
            userMap[order.user._id].spent  += order.totalPrice;
            if (new Date(order.createdAt) > new Date(userMap[order.user._id].lastOrder)) {
              userMap[order.user._id].lastOrder = order.createdAt;
            }
          }
        });
        setCustomers(Object.values(userMap).sort((a,b) => b.spent - a.spent));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Customer Management</h2>
        <p className="text-gray-400 text-sm">{customers.length} customers with orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-3xl font-bold text-blue-600">{customers.length}</p>
          <p className="text-gray-400 text-sm mt-1">Total Customers</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-3xl font-bold text-green-600">
            ${customers.reduce((s,c) => s+c.spent, 0).toFixed(0)}
          </p>
          <p className="text-gray-400 text-sm mt-1">Total Revenue</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-3xl font-bold text-purple-600">
            ${customers.length > 0 ? (customers.reduce((s,c) => s+c.spent, 0) / customers.length).toFixed(0) : 0}
          </p>
          <p className="text-gray-400 text-sm mt-1">Avg. Customer Value</p>
        </div>
      </div>

      <div className="mb-4">
        <input type="text" placeholder="Search customers..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading customers...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500 text-xs uppercase">
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Orders</th>
                  <th className="px-5 py-4">Total Spent</th>
                  <th className="px-5 py-4">Avg. Order</th>
                  <th className="px-5 py-4">Last Order</th>
                  <th className="px-5 py-4">Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => {
                  const tier = c.spent > 1000 ? { label: '👑 VIP', color: 'bg-yellow-100 text-yellow-700' }
                             : c.spent > 500  ? { label: '⭐ Gold', color: 'bg-orange-100 text-orange-600' }
                             : c.orders > 2   ? { label: '🔵 Regular', color: 'bg-blue-100 text-blue-600' }
                             :                  { label: '🆕 New', color: 'bg-gray-100 text-gray-500' };
                  return (
                    <tr key={c._id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                            {c.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{c.name}</p>
                            <p className="text-xs text-gray-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 font-medium">{c.orders}</td>
                      <td className="px-5 py-4 font-bold text-gray-800">${c.spent.toFixed(2)}</td>
                      <td className="px-5 py-4 text-gray-500">${(c.spent / c.orders).toFixed(2)}</td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{new Date(c.lastOrder).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${tier.color}`}>{tier.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No customers found</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCustomers;
