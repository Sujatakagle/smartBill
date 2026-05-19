const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const publicUser = (user) => {
  const raw = user.toObject ? user.toObject() : user;
  const nameParts = (raw.name || '').trim().split(/\s+/).filter(Boolean);
  const firstName = raw.firstName || nameParts[0] || '';
  const lastName = raw.lastName || nameParts.slice(1).join(' ') || '';

  return {
    id: raw._id || raw.id,
    name: raw.name || [firstName, lastName].filter(Boolean).join(' '),
    firstName,
    lastName,
    email: raw.email,
  };
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const nameParts = (name || '').trim().split(/\s+/).filter(Boolean);
    user = new User({
      name,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' '),
      email,
      password
    });
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: publicUser(user) });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: publicUser(user) });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(publicUser(user));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !email) {
      return res.status(400).json({ msg: 'First name and email are required' });
    }

    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });

    if (existingUser) {
      return res.status(400).json({ msg: 'Email is already in use' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.firstName = firstName.trim();
    user.lastName = (lastName || '').trim();
    user.name = [user.firstName, user.lastName].filter(Boolean).join(' ');
    user.email = email.trim().toLowerCase();

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters' });
      }
      user.password = password;
    }

    await user.save();

    res.json(publicUser(user));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
