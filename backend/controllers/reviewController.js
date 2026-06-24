const Review  = require('../models/Review');
const Product = require('../models/Product');

// @GET /api/reviews/:productId
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      status: 'approved',
    }).populate('user', 'name avatar').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @POST /api/reviews/:productId
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment)
      return res.status(400).json({ message: 'Rating and comment are required' });

    const existing = await Review.findOne({ user: req.user._id, product: req.params.productId });
    if (existing)
      return res.status(400).json({ message: 'You already reviewed this product' });

    const review = await Review.create({
      user:    req.user._id,
      product: req.params.productId,
      name:    req.user.name,
      rating:  Number(rating),
      comment,
    });

    // Update product avg rating
    const all = await Review.find({ product: req.params.productId, status: 'approved' });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await Product.findByIdAndUpdate(req.params.productId, {
      rating: Math.round(avg * 10) / 10,
      numReviews: all.length,
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'You already reviewed this product' });
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/reviews/:id
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    review.rating  = req.body.rating  || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();
    res.json(review);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: 'Not authorized' });
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @GET /api/reviews  (admin)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'name email')
      .populate('product', 'name image')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @PUT /api/reviews/:id/status  (admin)
const updateReviewStatus = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getProductReviews, addReview, updateReview, deleteReview, getAllReviews, updateReviewStatus };