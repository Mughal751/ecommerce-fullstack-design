import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
// import { useState, useEffect, useCallback } from 'react';

function Login() {
  const { login, googleLogin, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  // Load Google script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleGoogleResponse,
      });
      window.google?.accounts.id.renderButton(
        document.getElementById('google-btn'),
        { theme: 'outline', size: 'large', width: '100%', text: 'signin_with' }
      );
    };

    return () => document.body.removeChild(script);
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      setError('');
      // Decode the JWT token from Google
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      await googleLogin(payload);
      navigate('/');
    } catch (err) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-blue-600 mb-1 block">🛒 ShopZone</Link>
          <h2 className="text-xl font-semibold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-400 text-sm mt-1">Login to your account to continue shopping</p>
        </div>

        {/* Google Button */}
        <div id="google-btn" className="w-full mb-4 flex justify-center"></div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs font-medium">OR LOGIN WITH EMAIL</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
            <span>❌</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {loading ? '⏳ Logging in...' : 'Login →'}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Sign Up Free 🎉
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
