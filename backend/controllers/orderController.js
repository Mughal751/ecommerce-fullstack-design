const Order  = require('../models/Order');
const nodemailer = require('nodemailer');

// Send confirmation email
const sendOrderEmail = async (userEmail, userName, order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsHTML = order.orderItems.map(item => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${item.price}</td>
      </tr>
    `).join('');

    await transporter.sendMail({
      from: `"ShopZone" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `✅ Order Confirmed — Tracking ID: ${order.trackingId}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
          <div style="background:#2563eb;padding:20px;border-radius:10px 10px 0 0;text-align:center">
            <h1 style="color:white;margin:0">🛒 ShopZone</h1>
          </div>
          <div style="background:#f9fafb;padding:30px;border-radius:0 0 10px 10px">
            <h2 style="color:#1f2937">Hi ${userName}! Your order is confirmed 🎉</h2>
            <p style="color:#6b7280">Thank you for shopping with ShopZone. Here are your order details:</p>

            <div style="background:white;border-radius:8px;padding:16px;margin:20px 0">
              <p><strong>Tracking ID:</strong> <span style="color:#2563eb;font-size:18px">${order.trackingId}</span></p>
              <p><strong>Payment:</strong> ${order.paymentMethod}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>

            <h3 style="color:#1f2937">Order Items:</h3>
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr style="background:#e5e7eb">
                  <th style="padding:8px;text-align:left">Product</th>
                  <th style="padding:8px;text-align:center">Qty</th>
                  <th style="padding:8px;text-align:right">Price</th>
                </tr>
              </thead>
              <tbody>${itemsHTML}</tbody>
            </table>

            <div style="margin-top:20px;text-align:right">
              <p><strong>Subtotal:</strong> $${order.itemsPrice}</p>
              <p><strong>Shipping:</strong> ${order.shippingPrice === 0 ? 'Free' : '$' + order.shippingPrice}</p>
              <p style="font-size:18px;color:#2563eb"><strong>Total: $${order.totalPrice}</strong></p>
            </div>

            <div style="background:#dbeafe;border-radius:8px;padding:16px;margin-top:20px">
              <h3 style="margin:0 0 8px;color:#1e40af">Delivery Address</h3>
              <p style="margin:0;color:#1f2937">
                ${order.shippingAddress.fullName}<br/>
                ${order.shippingAddress.address}, ${order.shippingAddress.city}<br/>
                📞 ${order.shippingAddress.phone}
              </p>
            </div>

            <p style="color:#6b7280;margin-top:30px;font-size:13px">
              Need help? Email us at support@shopzone.pk or reply to this email.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

// @POST /api/orders  (protected)
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: 'No order items' });

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    // Send confirmation email
    await sendOrderEmail(req.user.email, req.user.name, order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/orders/myorders  (protected)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/orders/:id  (protected)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/orders  (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/orders/:id/status  (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status || order.status;
    if (req.body.status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };