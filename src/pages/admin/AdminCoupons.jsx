import { useState } from 'react';

const initialCoupons = [
  { id: 1, code: 'SHOPZONE20', type: 'percentage', value: 20, minOrder: 0,   uses: 0, active: true,  expiry: '2026-12-31' },
  { id: 2, code: 'SAVE10',     type: 'percentage', value: 10, minOrder: 50,  uses: 0, active: true,  expiry: '2026-09-30' },
  { id: 3, code: 'FLAT50',     type: 'fixed',      value: 50, minOrder: 200, uses: 0, active: true,  expiry: '2026-08-31' },
  { id: 4, code: 'WELCOME',    type: 'percentage', value: 15, minOrder: 0,   uses: 0, active: false, expiry: '2026-07-01' },
];

const empty = { code: '', type: 'percentage', value: '', minOrder: 0, expiry: '', active: true };

function AdminCoupons() {
  const [coupons, setCoupons]   = useState(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(empty);
  const [msg, setMsg]           = useState('');

  const handleSave = () => {
    if (!form.code || !form.value) { setMsg('❌ Code and value are required'); return; }
    const newCoupon = { ...form, id: Date.now(), uses: 0 };
    setCoupons(prev => [newCoupon, ...prev]);
    setShowForm(false);
    setForm(empty);
    setMsg('✅ Coupon created!');
    setTimeout(() => setMsg(''), 3000);
  };

  const toggleActive = (id) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    setMsg('✅ Coupon deleted');
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Coupons & Discounts</h2>
          <p className="text-gray-400 text-sm">{coupons.filter(c=>c.active).length} active coupons</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition">
          ➕ Create Coupon
        </button>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-xl mb-4 text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map(c => (
          <div key={c.id} className={`bg-white rounded-2xl shadow p-5 border-l-4 ${c.active ? 'border-green-500' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xl font-bold text-gray-800 tracking-widest">{c.code}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">
                  {c.type === 'percentage' ? `${c.value}% off` : `$${c.value} off`}
                  {c.minOrder > 0 ? ` · Min order $${c.minOrder}` : ''}
                </p>
                <p className="text-gray-400 text-xs mt-1">Expires: {c.expiry} · Used: {c.uses} times</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(c.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${c.active ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                  {c.active ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => deleteCoupon(c.id)}
                  className="text-xs px-3 py-1.5 bg-red-50 text-red-500 rounded-lg font-semibold hover:bg-red-100 transition">
                  🗑️
                </button>
              </div>
            </div>
            {/* Visual coupon */}
            <div className={`border-2 border-dashed rounded-xl p-3 text-center ${c.active ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <p className="text-xs text-gray-400 mb-1">DISCOUNT CODE</p>
              <p className={`text-2xl font-black tracking-widest ${c.active ? 'text-green-600' : 'text-gray-400'}`}>{c.code}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">
                {c.type === 'percentage' ? `${c.value}% OFF` : `$${c.value} OFF`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-800">🎟️ Create Coupon</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Coupon Code *</label>
                <input type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                  placeholder="SUMMER25" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                    <option value="percentage">Percentage %</option>
                    <option value="fixed">Fixed $</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Value *</label>
                  <input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})}
                    placeholder={form.type === 'percentage' ? '20' : '50'}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Min Order ($)</label>
                  <input type="number" value={form.minOrder} onChange={e => setForm({...form, minOrder: e.target.value})}
                    placeholder="0" className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry Date</label>
                  <input type="date" value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>
            </div>
            {msg && <p className="text-red-500 text-sm mt-3">{msg}</p>}
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-300 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleSave}
                className="flex-1 bg-blue-600 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-blue-700 active:scale-95 transition">
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCoupons;
