const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { User } = require('../models');

// @route   PUT api/users/become-partner
// @desc    Upgrade a logged-in user's role to PARTNER
// @access  Private (hanya untuk user yang login)
router.put('/become-partner', authMiddleware, async (req, res) => {
  try {
    // Cari user berdasarkan ID dari token
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Cek jika user sudah menjadi PARTNER atau ADMIN
    if (user.role === 'PARTNER' || user.role === 'ADMIN') {
      return res.status(400).json({ msg: 'User is already a partner or admin' });
    }

    // Update role menjadi PARTNER
    user.role = 'PARTNER';
    await user.save();

    // Kirim kembali data user yang sudah diupdate (tanpa password)
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json(userResponse);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;