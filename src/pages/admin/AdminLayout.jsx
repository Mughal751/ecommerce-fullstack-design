import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../AuthContext';

function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <p className="text-6xl mb-4">🔒</p>
          <p className="text-xl font-bold text-gray-700 mb-2">Admin Access Only</p>
          <p className="text-gray-400 mb-6">You don't have permission to view this page</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const navGroups = [
    {
      label: 'Main',
      items: [
        { path: '/admin',           icon: '📊', label: 'Dashboard'  },
        { path: '/admin/analytics', icon: '📈', label: 'Analytics'  },
      ]
    },
    {
      label: 'Store',
      items: [
        { path: '/admin/products',  icon: '📦', label: 'Products'   },
        { path: '/admin/orders',    icon: '🛍️', label: 'Orders'     },
        { path: '/admin/inventory', icon: '🏭', label: 'Inventory'  },
        { path: '/admin/shipping',  icon: '🚚', label: 'Shipping'   },
      ]
    },
    {
      label: 'Users',
      items: [
        { path: '/admin/customers', icon: '👥', label: 'Customers'  },
        { path: '/admin/reviews',   icon: '⭐', label: 'Reviews'    },
      ]
    },
    {
      label: 'Marketing',
      items: [
        { path: '/admin/coupons',   icon: '🎟️', label: 'Coupons'    },
      ]
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Logo */}
      <div className="px-4 py-5 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
            <div>
              <p className="text-white font-bold text-sm leading-none">ShopZone</p>
              <p className="text-gray-400 text-xs">Admin Panel</p>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mx-auto">S</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex w-7 h-7 bg-white/10 rounded-lg items-center justify-center text-gray-400 hover:bg-white/20 hover:text-white transition text-xs"
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* User Card */}
      {!collapsed && (
        <div className="mx-3 my-3 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold text-sm truncate">{user.name}</p>
              <p className="text-gray-400 text-xs truncate">{user.email}</p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" title="Online"></div>
          </div>
          <div className="mt-2 flex gap-2">
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">👑 Admin</span>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">● Online</span>
          </div>
        </div>
      )}

      {/* Nav Groups */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-hide">
        {navGroups.map(group => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-3 mb-2">
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : ''}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium group relative ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-gray-400 hover:bg-white/8 hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && isActive && (
                      <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full opacity-80"></span>
                    )}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-full"></span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3 flex flex-col gap-0.5">
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-white/8 hover:text-white transition text-sm ${collapsed ? 'justify-center' : ''}`}
        >
          <span>🏠</span>
          {!collapsed && <span>View Store</span>}
        </Link>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition text-sm ${collapsed ? 'justify-center' : ''}`}
        >
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0f1117] z-40 transform transition-transform duration-300 md:hidden ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col fixed h-full bg-[#0f1117] transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-60'
      }`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 min-h-screen ${collapsed ? 'md:ml-16' : 'md:ml-60'}`}>

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
            >
              ☰
            </button>
            <div>
              <h2 className="font-bold text-gray-800 text-sm">
                {navGroups.flatMap(g => g.items).find(i => i.path === location.pathname)?.label || 'Dashboard'}
              </h2>
              <p className="text-gray-400 text-xs">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden sm:flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition border border-gray-200 px-3 py-1.5 rounded-lg hover:border-blue-300">
              🌐 View Store
            </Link>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;