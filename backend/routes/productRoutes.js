const express = require('express');
const router  = express.Router();
const {
  getProducts, getDeals, getFeatured,
  getProductById, createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',          getProducts);
router.get('/deals',     getDeals);
router.get('/featured',  getFeatured);
router.get('/:id',       getProductById);
router.post('/',         protect, adminOnly, createProduct);
router.put('/:id',       protect, adminOnly, updateProduct);
router.delete('/:id',    protect, adminOnly, deleteProduct);

module.exports = router;