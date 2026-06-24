const express = require('express');
const router  = express.Router();
const {
  getProductReviews, addReview, updateReview,
  deleteReview, getAllReviews, updateReviewStatus,
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',                              protect, adminOnly, getAllReviews);
router.get('/:productId',                    getProductReviews);
router.post('/:productId',                   protect, addReview);
router.put('/:id',                           protect, updateReview);
router.delete('/:id',                        protect, deleteReview);
router.put('/:id/status',                    protect, adminOnly, updateReviewStatus);

module.exports = router;