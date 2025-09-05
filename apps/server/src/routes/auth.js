const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Masih dibutuhkan untuk compare
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Mongoose: User.findOne({ email }) -> Sequelize: User.findOne({ where: { email } })
    let user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Mongoose: new User(...) + user.save() -> Sequelize: User.create(...)
    // Hook `beforeCreate` pada model akan otomatis hash password
    user = await User.create({
      name,
      email,
      password,
    });

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // 1 jam
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // --- PERUBAHAN DI SINI ---
        // Menggunakan instance method yang kita buat di model User.js
        const isMatch = await user.validPassword(password);
        
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        // PENTING: Lihat terminal backend Anda untuk error yang lebih detail
        console.error('LOGIN ERROR:', err); 
        res.status(500).send('Server Error');
    }
});

const authMiddleware = require('../middleware/auth');

// @route   GET api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // req.user.id didapat dari middleware
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } // Jangan kirim balik password
        });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;