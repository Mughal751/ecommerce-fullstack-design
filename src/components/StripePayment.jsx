import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import API from '../api';

function StripePayment({ amount, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cardStyle = {
    style: {
      base: {
        color: '#1f2937',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': { color: '#9ca3af' },
      },
      invalid: { color: '#ef4444', iconColor: '#ef4444' },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      // Create payment intent from backend
      const { data } = await API.post('/payment/create-payment-intent', { amount });

      // Confirm card payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        onError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        onSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="font-bold text-gray-800 text-lg mb-4">💳 Card Payment</h3>

      {/* Test card info */}
      <div className="bg-blue-50 rounded-xl p-4 mb-4 text-sm">
        <p className="font-semibold text-blue-700 mb-1">🧪 Test Card Details:</p>
        <p className="text-blue-600">Card: <strong>4242 4242 4242 4242</strong></p>
        <p className="text-blue-600">Expiry: <strong>Any future date</strong></p>
        <p className="text-blue-600">CVC: <strong>Any 3 digits</strong></p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="border border-gray-300 rounded-xl px-4 py-4 mb-4 focus-within:ring-2 focus-within:ring-blue-400">
          <CardElement options={cardStyle} />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
            ❌ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Processing...' : `💳 Pay $${amount.toFixed(2)}`}
        </button>
      </form>

      <div className="flex justify-center gap-3 mt-4 text-gray-400 text-xs">
        <span>🔒 Secured by Stripe</span>
        <span>💳 Visa</span>
        <span>💳 Mastercard</span>
      </div>
    </div>
  );
}

export default StripePayment;