import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import API from '../api';

function StarRating({ rating, setRating, interactive = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button
          key={s}
          type={interactive ? 'button' : undefined}
          onClick={() => interactive && setRating && setRating(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`text-2xl transition ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <span className={(hover || rating) >= s ? 'text-yellow-400' : 'text-gray-300'}>★</span>
        </button>
      ))}
    </div>
  );
}

function ProductReviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating]     = useState(5);
  const [comment, setComment]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg]           = useState('');
  const [editId, setEditId]     = useState(null);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get(`/reviews/${productId}`);
      setReviews(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (productId) fetchReviews(); }, [productId]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) { setMsg('❌ Please write a comment'); return; }
    setSubmitting(true);
    setMsg('');
    try {
      if (editId) {
        await API.put(`/reviews/${editId}`, { rating, comment });
        setMsg('✅ Review updated!');
        setEditId(null);
      } else {
        await API.post(`/reviews/${productId}`, { rating, comment });
        setMsg('✅ Review submitted!');
      }
      setShowForm(false);
      setRating(5);
      setComment('');
      fetchReviews();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Failed to submit review'));
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await API.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditId(review._id);
    setShowForm(true);
  };

  const userReview = reviews.find(r => r.user?._id === user?._id);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer Reviews</h2>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 mb-6 bg-blue-50 rounded-2xl p-5">
          <div className="text-center">
            <p className="text-5xl font-bold text-blue-600">{avgRating}</p>
            <div className="flex justify-center mt-1">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={`text-xl ${s <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1">
            {[5,4,3,2,1].map(s => {
              const count = reviews.filter(r => r.rating === s).length;
              const pct   = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={s} className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 w-4">{s}</span>
                  <span className="text-yellow-400 text-xs">★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-6">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Write Review Button */}
      {user ? (
        !userReview && !showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition"
          >
            ✍️ Write a Review
          </button>
        ) : null
      ) : (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link> to write a review
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 mb-6 border border-blue-100">
          <h3 className="font-bold text-gray-800 mb-4">{editId ? '✏️ Edit Review' : '✍️ Write a Review'}</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <StarRating rating={rating} setRating={setRating} interactive={true} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>
          {msg && (
            <p className={`text-sm mb-3 ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>
          )}
          <div className="flex gap-3">
            <button type="submit" disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition disabled:opacity-60">
              {submitting ? '⏳ Submitting...' : editId ? 'Update Review' : 'Submit Review'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); setMsg(''); }}
              className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </form>
      )}

      {msg && !showForm && (
        <p className={`text-sm mb-4 ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>
      )}

      {/* Reviews List */}
      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-gray-500 font-semibold">No reviews yet</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="bg-white rounded-2xl shadow p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
                    {review.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{review.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-sm ${s <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                      <span className="text-gray-400 text-xs">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit/Delete for own review */}
                {user && review.user?._id === user._id && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(review)}
                      className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition font-semibold">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(review._id)}
                      className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-semibold">
                      🗑️
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">"{review.comment}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductReviews;
