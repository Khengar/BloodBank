import express from 'express';
import { authenticateToken } from '../middleware/auth.mjs';
import { User } from '../models/User.mjs';

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current logged-in user's profile
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  // The middleware guarantees that req.user is available
  res.json(req.user);
});

// @route   PUT /api/users/me
// @desc    Update current logged-in user's profile
// @access  Private
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { name, phone, location } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields if they were provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;
