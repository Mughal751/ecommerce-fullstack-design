import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">

      {/* Newsletter */}
      <div className="bg-blue-600 px-6 py-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Subscribe to our Newsletter</h2>
        <p className="text-blue-100 mb-6">Get the latest deals and offers directly in your inbox</p>
        <div className="flex max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email..."
            className="flex-1 px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none"
          />
          <button className="bg-gray-900 text-white px-6 py-3 rounded-r-lg hover:bg-gray-700 transition font-semibold">
            Subscribe
          </button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">🛒 ShopZone</h3>
          <p className="text-sm text-gray-400 mb-4">
            Your one-stop shop for all electronics, beauty tech and smart home gadgets.
          </p>
          <div className="flex gap-3">
            {['📘','🐦','📸','▶️'].map((icon, i) => (
              <button key={i} className="bg-gray-700 p-2 rounded-lg hover:bg-blue-600 transition">
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
          <div className="flex flex-col gap-2 text-sm">
            {['Phones','Laptops','Tablets','Cameras','Watches','Headphones','Drones','Beauty Tech','Home Electronics'].map(cat => (
              <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="hover:text-blue-400 transition">
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm">
            {[
              { label: 'Home',     to: '/'         },
              { label: 'Products', to: '/products'  },
              { label: 'Deals 🔥', to: '/deals'     },
              { label: 'Cart',     to: '/cart'       },
              { label: 'Login',    to: '/login'      },
              { label: 'Register', to: '/register'   },
            ].map(link => (
              <Link key={link.label} to={link.to} className="hover:text-blue-400 transition">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
          <div className="flex flex-col gap-3 text-sm">
            <p>📍 Lahore, Pakistan</p>
            <p>📞 +92 315 6507602</p>
            <p>✉️ support@shopzone.pk</p>
            <p>🕐 Mon – Sat: 9am – 6pm</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© 2026 ShopZone. All rights reserved.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <span className="cursor-pointer hover:text-gray-300">Privacy Policy</span>
          <span className="cursor-pointer hover:text-gray-300">Terms of Service</span>
          <span className="cursor-pointer hover:text-gray-300">Refund Policy</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
