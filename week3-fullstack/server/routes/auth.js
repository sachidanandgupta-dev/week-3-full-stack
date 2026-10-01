const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const emailRx = /^\S+@\S+\.\S+$/;

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (!emailRx.test(email)) return res.status(400).json({ message: 'Invalid email address' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    res.status(201).json({ token: sign(user._id), user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: sign(user._id), user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
});

router.get('/me', protect, (req, res) => {
  const { _id, name, email } = req.user;
  res.json({ user: { id: _id, name, email } });
});

module.exports = router;
