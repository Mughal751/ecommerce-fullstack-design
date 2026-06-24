import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api';

const CATEGORIES = ['Phones','Laptops','Tablets','Cameras','Watches','Headphones','Drones','Accessories','Home Electronics','Beauty Tech'];

const emptyForm = {
  name: '', description: '', price: '', oldPrice: '', category: 'Phones',
  image: '', stock: '', rating: '4', badge: '', isFeatured: false, isDeal: false,
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [deleteId, setDeleteId] = useState(null);
  const [msg, setMsg]           = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd  = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description, price: p.price,
      oldPrice: p.oldPrice, category: p.category, image: p.image,
      stock: p.stock, rating: p.rating, badge: p.badge || '',
      isFeatured: p.isFeatured, isDeal: p.isDeal,
    });
    setEditId(p._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.image || !form.stock) {
      setMsg('❌ Please fill Name, Price, Image and Stock'); return;
    }
    setSaving(true);
    try {
      if (editId) {
        await API.put(`/products/${editId}`, form);
        setMsg('✅ Product updated!');
      } else {
        await API.post('/products', form);
        setMsg('✅ Product added!');
      }
      setShowForm(false);
      fetchProducts();
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.message || 'Error saving product'));
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setMsg('✅ Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch (e) { setMsg('❌ Delete failed'); }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat === 'All' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Products Management</h2>
          <p className="text-gray-400 text-sm">{products.length} total products</p>
        </div>
        <button onClick={openAdd}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition flex items-center gap-2">
          ➕ Add Product
        </button>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-xl mb-4 text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg} <button onClick={() => setMsg('')} className="ml-2 opacity-50 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input type="text" placeholder="Search products..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500 text-xs uppercase">
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Featured</th>
                  <th className="px-5 py-4">Deal</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                          {p.badge && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{p.badge}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{p.category}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-800">${p.price}</p>
                      <p className="text-xs text-gray-400 line-through">${p.oldPrice}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-semibold ${p.stock < 5 ? 'text-red-500' : p.stock < 10 ? 'text-yellow-500' : 'text-green-600'}`}>
                        {p.stock} {p.stock < 5 ? '⚠️' : ''}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${p.isFeatured ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                        {p.isFeatured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${p.isDeal ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                        {p.isDeal ? '🔥 Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)}
                          className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100 transition">
                          ✏️ Edit
                        </button>
                        <button onClick={() => setDeleteId(p._id)}
                          className="bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 transition">
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 py-12">No products found</p>
            )}
          </div>
        )}
      </div>

      {/* ── Add/Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-800">{editId ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="iPhone 15 Pro" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  rows={3} placeholder="Product description..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
              </div>
              {/* Price */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Price ($) *</label>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                  placeholder="999.99" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              {/* Old Price */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Old Price ($)</label>
                <input type="number" value={form.oldPrice} onChange={e => setForm({...form, oldPrice: e.target.value})}
                  placeholder="1199.99" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              {/* Category */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Category *</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {/* Stock */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Stock *</label>
                <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                  placeholder="50" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              {/* Image URL */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Image URL *</label>
                <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})}
                  placeholder="https://images.unsplash.com/..." className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                {form.image && (
                  <img src={form.image} alt="preview" className="mt-2 w-24 h-24 object-cover rounded-lg border" />
                )}
              </div>
              {/* Badge */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Badge</label>
                <input type="text" value={form.badge} onChange={e => setForm({...form, badge: e.target.value})}
                  placeholder="New / Hot / Sale" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              {/* Rating */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Rating (1-5)</label>
                <select value={form.rating} onChange={e => setForm({...form, rating: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                  {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ⭐</option>)}
                </select>
              </div>
              {/* Toggles */}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={form.isFeatured}
                  onChange={e => setForm({...form, isFeatured: e.target.checked})}
                  className="w-4 h-4 accent-blue-600" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Product</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="deal" checked={form.isDeal}
                  onChange={e => setForm({...form, isDeal: e.target.checked})}
                  className="w-4 h-4 accent-red-500" />
                <label htmlFor="deal" className="text-sm font-medium text-gray-700">🔥 Deal Product</label>
              </div>
            </div>

            {msg && (
              <div className={`mx-6 px-4 py-3 rounded-xl text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {msg}
              </div>
            )}

            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 active:scale-95 transition disabled:opacity-60">
                {saving ? '⏳ Saving...' : editId ? '✅ Update Product' : '➕ Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Product?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)}
                className="px-5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 active:scale-95 transition">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
