require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const hash = await bcrypt.hash('admin123', 10);
  await User.updateOne(
    { email: 'm81327913@gmail.com' },
    { $set: { password: hash } }
  );
  console.log('Password reset to: admin123');
  process.exit();
});