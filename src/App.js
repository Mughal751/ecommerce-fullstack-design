import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider }     from './CartContext';
import { AuthProvider }     from './AuthContext';
import { WishlistProvider } from './WishlistContext';
import Navbar         from './components/Navbar';
import Footer         from './components/Footer';
import Home           from './pages/Home';
import Products       from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart           from './pages/Cart';
import Deals          from './pages/Deals';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Checkout       from './pages/Checkout';
import Orders         from './pages/Orders';
import Wishlist       from './pages/Wishlist';
import TrackOrder     from './pages/TrackOrder';
import AISearch       from './pages/AISearch';
import Profile        from './pages/Profile';

// Admin
import AdminLayout    from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts  from './pages/admin/AdminProducts';
import AdminOrders    from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminInventory from './pages/admin/AdminInventory';
import AdminCoupons   from './pages/admin/AdminCoupons';
import AdminReviews   from './pages/admin/AdminReviews';
import AdminShipping  from './pages/admin/AdminShipping';

function AdminRoute({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/"            element={<><Navbar /><Home /><Footer /></>}           />
              <Route path="/products"    element={<><Navbar /><Products /><Footer /></>}        />
              <Route path="/product/:id" element={<><Navbar /><ProductDetails /><Footer /></>}  />
              <Route path="/cart"        element={<><Navbar /><Cart /><Footer /></>}            />
              <Route path="/deals"       element={<><Navbar /><Deals /><Footer /></>}           />
              <Route path="/login"       element={<><Navbar /><Login /><Footer /></>}           />
              <Route path="/register"    element={<><Navbar /><Register /><Footer /></>}        />
              <Route path="/checkout"    element={<Checkout />}                                 />
              <Route path="/orders"      element={<><Navbar /><Orders /><Footer /></>}          />
              <Route path="/my-orders"   element={<><Navbar /><Orders /><Footer /></>}          />
              <Route path="/wishlist"    element={<><Navbar /><Wishlist /><Footer /></>}        />
              <Route path="/track-order" element={<><Navbar /><TrackOrder /><Footer /></>}      />
              <Route path="/ai-search"   element={<><Navbar /><AISearch /><Footer /></>}        />
              <Route path="/profile"     element={<><Navbar /><Profile /><Footer /></>}         />

              {/* Admin */}
              <Route path="/admin"             element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products"    element={<AdminRoute><AdminProducts  /></AdminRoute>} />
              <Route path="/admin/orders"      element={<AdminRoute><AdminOrders    /></AdminRoute>} />
              <Route path="/admin/customers"   element={<AdminRoute><AdminCustomers /></AdminRoute>} />
              <Route path="/admin/analytics"   element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
              <Route path="/admin/inventory"   element={<AdminRoute><AdminInventory /></AdminRoute>} />
              <Route path="/admin/coupons"     element={<AdminRoute><AdminCoupons   /></AdminRoute>} />
              <Route path="/admin/reviews"     element={<AdminRoute><AdminReviews   /></AdminRoute>} />
              <Route path="/admin/shipping"    element={<AdminRoute><AdminShipping  /></AdminRoute>} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;