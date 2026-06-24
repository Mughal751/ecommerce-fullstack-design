import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';

function StatCard({ icon, label, value, change, color }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {change && (
          <p className={`text-xs font-medium ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {change} this month
          </p>
        )}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          API.get('/orders'),
          API.get('/products'),
        ]);

        const allOrders   = ordersRes.data;
        const allProducts = productsRes.data;

        const totalRevenue   = allOrders.reduce((s, o) => s + o.totalPrice, 0);
        const totalOrders    = allOrders.length;
        const totalProducts  = allProducts.length;
        const pendingOrders  = allOrders.filter(o => o.status === 'Pending').length;
        const lowStock       = allProducts.filter(p => p.stock < 5).length;

        setStats({ totalRevenue, totalOrders, totalProducts, pendingOrders, lowStock });
        setOrders(allOrders.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusColors = {
    Pending:    'bg-yellow-100 text-yellow-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped:    'bg-purple-100 text-purple-700',
    Delivered:  'bg-green-100 text-green-700',
    Cancelled:  'bg-red-100 text-red-700',
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-spin">⚙️</div>
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon="💰" label="Total Revenue"   value={`$${stats?.totalRevenue?.toFixed(2) || '0'}`} change="+12.5%" color="bg-green-100" />
        <StatCard icon="🛍️" label="Total Orders"    value={stats?.totalOrders    || 0} change="+8.2%"  color="bg-blue-100"   />
        <StatCard icon="📦" label="Total Products"  value={stats?.totalProducts  || 0} change="+3"     color="bg-purple-100" />
        <StatCard icon="⏳" label="Pending Orders"  value={stats?.pendingOrders  || 0} change={null}   color="bg-yellow-100" />
      </div>

      {/* Alert for low stock */}
      {stats?.lowStock > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <p className="text-red-700 text-sm font-medium">
            {stats.lowStock} product{stats.lowStock > 1 ? 's are' : ' is'} running low on stock!{' '}
            <Link to="/admin/inventory" className="underline font-bold">Check Inventory →</Link>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline">View All →</Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase border-b">
                    <th className="pb-3">Tracking ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="py-3 font-mono text-blue-600 font-semibold text-xs">
                        {order.trackingId}
                      </td>
                      <td className="py-3 text-gray-700">
                        {order.user?.name || 'Guest'}
                      </td>
                      <td className="py-3 font-bold text-gray-800">${order.totalPrice}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            {[
              { to: '/admin/products/new', icon: '➕', label: 'Add New Product',   color: 'bg-blue-600'  },
              { to: '/admin/orders',       icon: '📋', label: 'Manage Orders',     color: 'bg-green-600' },
              { to: '/admin/coupons',      icon: '🎟️', label: 'Create Coupon',     color: 'bg-purple-600'},
              { to: '/admin/inventory',    icon: '🏭', label: 'Check Inventory',   color: 'bg-orange-500'},
              { to: '/admin/analytics',    icon: '📈', label: 'View Analytics',    color: 'bg-indigo-600'},
              { to: '/admin/customers',    icon: '👥', label: 'View Customers',    color: 'bg-pink-500'  },
            ].map(a => (
              <Link key={a.to} to={a.to}
                className={`${a.color} text-white px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-3 hover:opacity-90 active:scale-95 transition`}>
                <span>{a.icon}</span> {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
