const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/auth/register', (req, res) => {
  res.render('register');
});

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await User.create({ username, password });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    console.log(`User ${username} registered successfully, token generated and sent as httpOnly cookie.`);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Registration error:', error.message, error.stack);
    res.status(500).send(error.message);
  }
});

router.get('/auth/login', (req, res) => {
  res.render('login');
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Login attempt failed: User not found');
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log(`User ${username} logged in successfully, token generated.`);
      res.cookie('token', token, { httpOnly: true });
      res.json({ token }); // This ensures the client receives a JSON response
    } else {
      console.log('Login attempt failed: Password is incorrect');
      return res.status(400).json({ message: 'Password is incorrect' });
    }
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    return res.status(500).json({ message: error.message });
  }
});

router.get('/auth/logout', (req, res) => {
  res.clearCookie('token');
  console.log('User logged out successfully, token cleared.');
  res.redirect('/auth/login?logout=true');
});

module.exports = router;