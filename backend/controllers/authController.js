const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill all fields' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'Email already registered' });

    // Let the pre('save') hook handle hashing
    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Please fill all fields' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/google  — Google OAuth login/register
const googleAuth = async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;

    if (!email || !googleId)
      return res.status(400).json({ message: 'Invalid Google credentials' });

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Update googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar   = avatar || user.avatar;
        await user.save();
      }
    } else {
      // Create new user from Google
      user = await User.create({
        name,
        email,
        googleId,
        avatar: avatar || '',
        password: '', // No password for Google users
      });
    }

    res.json({
      _id:    user._id,
      name:   user.name,
      email:  user.email,
      role:   user.role,
      avatar: user.avatar,
      token:  generateToken(user._id),
    });
  } catch (error) {
    console.error('Google auth error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/auth/profile  (protected)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/auth/profile  (protected)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name  = req.body.name  || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await user.save();
    res.json({
      _id:   updated._id,
      name:  updated.name,
      email: updated.email,
      role:  updated.role,
      token: generateToken(updated._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, googleAuth, getProfile, updateProfile };