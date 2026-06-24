const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  oldPrice: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Phones', 'Laptops', 'Tablets', 'Cameras', 'Watches', 'Headphones', 'Drones', 'Accessories', 'Home Electronics', 'Beauty Tech'],
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  badge: {
    type: String,
    default: '',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isDeal: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);