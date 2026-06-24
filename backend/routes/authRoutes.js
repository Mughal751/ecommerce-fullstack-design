const express = require('express');
const router  = express.Router();
const { register, login, googleAuth, getProfile, updateProfile } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.post('/register', register);
router.post('/login',    login);
router.post('/google',   googleAuth);
router.get('/profile',   protect, getProfile);
router.put('/profile',   protect, updateProfile);


router.get('/admin/customers', protect, adminOnly, async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;