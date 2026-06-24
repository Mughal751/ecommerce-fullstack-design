import { useState } from 'react';

const demoReviews = [
  { id: 1, product: 'iPhone 15 Pro',         user: 'Ahmed Khan',    rating: 5, comment: 'Amazing phone! Excellent camera quality.',              date: '2026-06-15', status: 'approved' },
  { id: 2, product: 'Sony WH-1000XM5',       user: 'Sara Ali',      rating: 4, comment: 'Great noise cancellation, very comfortable.',            date: '2026-06-14', status: 'approved' },
  { id: 3, product: 'MacBook Pro 16"',        user: 'Hassan Raza',   rating: 5, comment: 'Best laptop I have ever used. M3 Max is insane!',        date: '2026-06-13', status: 'pending'  },
  { id: 4, product: 'Dyson Airwrap',          user: 'Fatima Malik',  rating: 5, comment: 'Worth every penny! My hair looks amazing.',              date: '2026-06-12', status: 'pending'  },
  { id: 5, product: 'Samsung Galaxy S24',     user: 'Usman Ghani',   rating: 3, comment: 'Good phone but battery life could be better.',           date: '2026-06-11', status: 'approved' },
  { id: 6, product: 'Apple Watch Ultra 2',    user: 'Zara Hussain',  rating: 5, comment: 'Incredible watch, GPS accuracy is perfect for hiking.',  date: '2026-06-10', status: 'rejected' },
];

function AdminReviews() {
  const [reviews, setReviews]   = useState(demoReviews);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');

  const updateStatus = (id, status) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const filtered = reviews.filter(r => {
    const matchFilter = filter === 'all' || r.status === filter;
    const matchSearch = r.product.toLowerCase().includes(search.toLowerCase()) ||
                        r.user.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const Stars = ({ n }) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`text-sm ${s<=n?'text-yellow-400':'text-gray-200'}`}>★</span>
      ))}
    </div>
  );

  const statusStyle = {
    approved: 'bg-green-100 text-green-700',
    pending:  'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-500',
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Reviews Management</h2>
        <p className="text-gray-400 text-sm">Moderate customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending',  value: reviews.filter(r=>r.status==='pending').length,  color: 'text-yellow-500' },
          { label: 'Approved', value: reviews.filter(r=>r.status==='approved').length, color: 'text-green-500'  },
          { label: 'Rejected', value: reviews.filter(r=>r.status==='rejected').length, color: 'text-red-500'    },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input type="text" placeholder="Search by product or customer..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <div className="flex gap-2">
          {['all','pending','approved','rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize border-2 transition ${
                filter === f ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map(review => (
          <div key={review.id} className="bg-white rounded-2xl shadow p-5">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
                    {review.user.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{review.user}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold ${statusStyle[review.status]}`}>
                    {review.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-blue-600 mb-1">📦 {review.product}</p>
                <Stars n={review.rating} />
                <p className="text-gray-600 text-sm mt-2">"{review.comment}"</p>
              </div>
              <div className="flex sm:flex-col gap-2 flex-shrink-0">
                {review.status !== 'approved' && (
                  <button onClick={() => updateStatus(review.id, 'approved')}
                    className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-100 transition">
                    ✅ Approve
                  </button>
                )}
                {review.status !== 'rejected' && (
                  <button onClick={() => updateStatus(review.id, 'rejected')}
                    className="bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 transition">
                    ❌ Reject
                  </button>
                )}
                <button onClick={() => deleteReview(review.id)}
                  className="bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-100 transition">
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No reviews found</div>
        )}
      </div>
    </div>
  );
}

export default AdminReviews;
