import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

function Profile() {
  const { user, saveUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-xl font-semibold text-gray-700">Please login to view profile</p>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
          Login →
        </Link>
      </div>
    );
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await API.put('/auth/profile', {
        name:  form.name,
        email: form.email,
      });
      saveUser({ ...user, ...data });
      setSuccess('✅ Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await API.put('/auth/profile', { password: passwords.newPassword });
      setSuccess('✅ Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile',   label: '👤 My Profile'    },
    { id: 'password',  label: '🔒 Change Password' },
    { id: 'orders',    label: '📦 My Orders'      },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>

        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow p-6">

              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-3">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-bold text-gray-800">{user.name}</p>
                <p className="text-gray-400 text-sm truncate">{user.email}</p>
                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {user.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                </span>
              </div>

              {/* Nav */}
              <div className="flex flex-col gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setError(''); setSuccess(''); }}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}

                {user.role === 'admin' && (
                  <Link to="/admin"
                    className="text-left px-4 py-3 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-50 transition">
                    ⚙️ Admin Panel
                  </Link>
                )}

                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition mt-2"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">

            {/* Success/Error */}
            {success && <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-4">{success}</div>}
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4">❌ {error}</div>}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">👤 My Profile</h2>
                <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Account Type</label>
                    <input
                      type="text"
                      value={user.googleId ? 'Google Account' : 'Email Account'}
                      disabled
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {loading ? '⏳ Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">🔒 Change Password</h2>
                {user.googleId ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-700 text-sm">
                    ⚠️ You signed in with Google. Password change is not available for Google accounts.
                  </div>
                ) : (
                  <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label>
                      <input
                        type="password"
                        value={passwords.newPassword}
                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                        placeholder="Min 6 characters"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        placeholder="Repeat new password"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-60"
                    >
                      {loading ? '⏳ Changing...' : 'Change Password'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📦 My Orders</h2>
                <p className="text-gray-400 text-sm mb-4">View all your orders and track them</p>
                <Link
                  to="/orders"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition inline-block"
                >
                  View All Orders →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;