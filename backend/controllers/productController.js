const Product = require('../models/Product');

// @GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;
    let query = {};

    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let products = Product.find(query);

    if (sort === 'price-asc')  products = products.sort({ price:  1 });
    if (sort === 'price-desc') products = products.sort({ price: -1 });
    if (sort === 'rating')     products = products.sort({ rating: -1 });
    if (sort === 'newest')     products = products.sort({ createdAt: -1 });

    const result = await products;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/products/deals
const getDeals = async (req, res) => {
  try {
    const deals = await Product.find({ isDeal: true });
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/products/featured
const getFeatured = async (req, res) => {
  try {
    const featured = await Product.find({ isFeatured: true }).limit(8);
    res.json(featured);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/products  (admin only)
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/products/:id  (admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/products/:id  (admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getDeals, getFeatured, getProductById, createProduct, updateProduct, deleteProduct };