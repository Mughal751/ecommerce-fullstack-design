import { useState, useEffect } from 'react'
import API from '../../api';

function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(null);
  const [msg, setMsg]           = useState('');
  const [filter, setFilter]     = useState('all');

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const updateStock = async (id, newStock) => {
    if (newStock < 0) return;
    setUpdating(id);
    try {
      await API.put(`/products/${id}`, { stock: newStock });
      setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));
      setMsg('✅ Stock updated!');
      setTimeout(() => setMsg(''), 2000);
    } catch (e) { setMsg('❌ Update failed'); }
    finally { setUpdating(null); }
  };

  const filtered = products.filter(p => {
    if (filter === 'out')  return p.stock === 0;
    if (filter === 'low')  return p.stock > 0 && p.stock < 5;
    if (filter === 'ok')   return p.stock >= 5;
    return true;
  });

  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock   = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const inStock    = products.filter(p => p.stock >= 5).length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Inventory Tracking</h2>
        <p className="text-gray-400 text-sm">Monitor and update product stock levels</p>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-xl mb-4 text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { key: 'all', label: `All (${products.length})`,         color: 'blue'   },
          { key: 'out', label: `Out of Stock (${outOfStock})`,     color: 'red'    },
          { key: 'low', label: `Low Stock (${lowStock})`,          color: 'yellow' },
          { key: 'ok',  label: `In Stock (${inStock})`,            color: 'green'  },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition ${
              filter === f.key
                ? f.color === 'blue'   ? 'border-blue-600 bg-blue-600 text-white'
                : f.color === 'red'    ? 'border-red-500 bg-red-500 text-white'
                : f.color === 'yellow' ? 'border-yellow-500 bg-yellow-500 text-white'
                :                        'border-green-500 bg-green-500 text-white'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading inventory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500 text-xs uppercase">
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock Status</th>
                  <th className="px-5 py-4">Update Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => {
                  const status = p.stock === 0 ? { label: 'Out of Stock', color: 'bg-red-100 text-red-600'    }
                               : p.stock < 5   ? { label: 'Low Stock',    color: 'bg-yellow-100 text-yellow-700' }
                               :                 { label: 'In Stock',     color: 'bg-green-100 text-green-600'  };
                  return (
                    <tr key={p._id} className={`hover:bg-gray-50 transition ${p.stock === 0 ? 'bg-red-50' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                          <p className="font-medium text-gray-800">{p.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{p.category}</td>
                      <td className="px-5 py-4 font-bold text-gray-800">${p.price}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${status.color}`}>
                          {status.label} ({p.stock})
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateStock(p._id, p.stock - 1)} disabled={updating === p._id || p.stock === 0}
                            className="w-7 h-7 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold text-sm flex items-center justify-center transition disabled:opacity-40">
                            −
                          </button>
                          <span className="w-10 text-center font-bold text-gray-800">{p.stock}</span>
                          <button onClick={() => updateStock(p._id, p.stock + 1)} disabled={updating === p._id}
                            className="w-7 h-7 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold text-sm flex items-center justify-center transition">
                            +
                          </button>
                          <button onClick={() => updateStock(p._id, p.stock + 10)} disabled={updating === p._id}
                            className="ml-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-blue-100 transition">
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No products match this filter</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminInventory;
