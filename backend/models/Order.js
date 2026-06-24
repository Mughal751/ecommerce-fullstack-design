const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:    { type: String,  required: true },
  image:   { type: String,  required: true },
  price:   { type: Number,  required: true },
  quantity:{ type: Number,  required: true },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [orderItemSchema],

  // Shipping address
  shippingAddress: {
    fullName: { type: String, required: true },
    phone:    { type: String, required: true },
    address:  { type: String, required: true },
    city:     { type: String, required: true },
    country:  { type: String, default: 'Pakistan' },
  },

  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Card', 'PayPal'],
    default: 'Cash on Delivery',
  },

  itemsPrice:    { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  totalPrice:    { type: Number, required: true, default: 0 },

  isPaid:     { type: Boolean, default: false },
  paidAt:     { type: Date },

  isDelivered:  { type: Boolean, default: false },
  deliveredAt:  { type: Date },

  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },

  trackingId: {
    type: String,
    default: () => 'SZ-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
  },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);