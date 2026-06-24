const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmationEmail = async (order, userEmail, userName) => {
  const itemsHTML = order.orderItems.map(item => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #f0f0f0;">
        <img src="${item.image}" width="60" height="60" style="border-radius:8px;object-fit:cover;" />
      </td>
      <td style="padding:10px;border-bottom:1px solid #f0f0f0;">
        <strong>${item.name}</strong><br/>
        <span style="color:#666;font-size:13px;">Qty: ${item.quantity}</span>
      </td>
      <td style="padding:10px;border-bottom:1px solid #f0f0f0;text-align:right;">
        <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
      </td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"ShopZone 🛒" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `✅ Order Confirmed — Tracking ID: ${order.trackingId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px;">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#2563eb,#3b82f6);padding:30px;border-radius:16px 16px 0 0;text-align:center;">
          <h1 style="color:white;margin:0;font-size:28px;">🛒 ShopZone</h1>
          <p style="color:#bfdbfe;margin:8px 0 0;">Your order has been confirmed!</p>
        </div>

        <!-- Body -->
        <div style="background:white;padding:30px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          
          <h2 style="color:#1f2937;margin-top:0;">Hi ${userName}! 👋</h2>
          <p style="color:#6b7280;">Thank you for shopping with ShopZone. Your order has been placed successfully and is being processed.</p>

          <!-- Tracking ID -->
          <div style="background:#eff6ff;border:2px solid #bfdbfe;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
            <p style="color:#6b7280;margin:0 0 8px;font-size:13px;">YOUR TRACKING ID</p>
            <h2 style="color:#2563eb;margin:0;font-size:28px;letter-spacing:2px;">${order.trackingId}</h2>
          </div>

          <!-- Order Details -->
          <h3 style="color:#1f2937;border-bottom:2px solid #f0f0f0;padding-bottom:10px;">📦 Order Details</h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            <thead>
              <tr style="background:#f9fafb;">
                <th style="padding:10px;text-align:left;color:#6b7280;font-size:13px;">Image</th>
                <th style="padding:10px;text-align:left;color:#6b7280;font-size:13px;">Product</th>
                <th style="padding:10px;text-align:right;color:#6b7280;font-size:13px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <!-- Price Summary -->
          <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-top:20px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#6b7280;">Subtotal</span>
              <span style="font-weight:600;">$${order.itemsPrice?.toFixed(2)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#6b7280;">Shipping</span>
              <span style="font-weight:600;color:#16a34a;">${order.shippingPrice === 0 ? 'Free' : '$' + order.shippingPrice?.toFixed(2)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;border-top:2px solid #e5e7eb;padding-top:12px;margin-top:8px;">
              <span style="font-weight:700;font-size:16px;">Total</span>
              <span style="font-weight:700;font-size:16px;color:#2563eb;">$${order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>

          <!-- Shipping Address -->
          <h3 style="color:#1f2937;border-bottom:2px solid #f0f0f0;padding-bottom:10px;margin-top:24px;">📍 Shipping Address</h3>
          <p style="color:#4b5563;line-height:1.8;margin:0;">
            <strong>${order.shippingAddress.fullName}</strong><br/>
            ${order.shippingAddress.address}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.country}<br/>
            📞 ${order.shippingAddress.phone}
          </p>

          <!-- Payment Method -->
          <div style="margin-top:20px;padding:16px;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">
            <p style="margin:0;color:#166534;">
              💳 <strong>Payment Method:</strong> ${order.paymentMethod}
            </p>
          </div>

          <!-- Footer -->
          <div style="margin-top:30px;padding-top:20px;border-top:2px solid #f0f0f0;text-align:center;">
            <p style="color:#6b7280;font-size:13px;">Need help? Contact us at support@shopzone.pk</p>
            <p style="color:#9ca3af;font-size:12px;margin-top:8px;">© 2026 ShopZone. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderConfirmationEmail };