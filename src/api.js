import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('shopzone_user'));
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  } catch {}
  return config;
});

// Products
export const fetchProducts    = (params) => API.get('/products', { params });
export const fetchProductById = (id)     => API.get(`/products/${id}`);
export const fetchDeals       = ()       => API.get('/products/deals');
export const fetchFeatured    = ()       => API.get('/products/featured');

// Auth
export const registerUser  = (data) => API.post('/auth/register', data);
export const loginUser     = (data) => API.post('/auth/login', data);
export const getProfile    = ()     => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Orders
export const createOrder  = (data) => API.post('/orders', data);
export const getMyOrders  = ()     => API.get('/orders/myorders');
export const getOrderById = (id)   => API.get(`/orders/${id}`);

// Reviews
export const getReviews   = (productId) => API.get(`/reviews/${productId}`);
export const addReview    = (productId, data) => API.post(`/reviews/${productId}`, data);

// AI Search
export const aiSearch = (query) => API.post('/ai/search', { query });

export default API;