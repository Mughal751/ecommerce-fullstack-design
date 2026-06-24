const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Name is required'],
    trim:     true,
  },
  email: {
    type:      String,
    required:  [true, 'Email is required'],
    unique:    true,
    lowercase: true,
    trim:      true,
  },
  password: {
    type:    String,
    default: '',
    // No minlength here — Google users have empty password
  },
  role: {
    type:    String,
    enum:    ['user', 'admin'],
    default: 'user',
  },
  avatar: {
    type:    String,
    default: '',
  },
  googleId: {
    type:    String,
    default: '',
  },
}, { timestamps: true });

// Hash password before saving — only if password exists and was modified
userSchema.pre('save', async function (next) {
  // Skip if no password (Google users) or password not modified
  if (!this.password || !this.isModified('password')) return next();
  try {
    const salt    = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);