// routes/requests.js
import express from 'express';
import { body, query, validationResult } from 'express-validator';
import {BloodRequest} from '../models/BloodRequest.mjs';
import { authenticateToken, optionalAuth } from '../middleware/auth.mjs';

const router = express.Router();

// GET ALL BLOOD REQUESTS (with filters & pagination)
router.get('/', [
  query('bloodType')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood type'),
  query('urgency')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid urgency level'),
  query('location')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Location cannot be empty'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });

    const { bloodType, urgency, location, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };
    if (bloodType) query.bloodType = bloodType;
    if (urgency) query.urgency = urgency;
    if (location) query.location = new RegExp(location, 'i');

    const skip = (page - 1) * limit;

    const requests = await BloodRequest.find(query)
      .populate('userId', 'name email phone')
      .sort({ urgency: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BloodRequest.countDocuments(query);

    res.json({
      requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRequests: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to fetch blood requests' });
  }
});

// GET USER'S OWN BLOOD REQUESTS
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const requests = await BloodRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ requests });
  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({ error: 'Failed to fetch your requests' });
  }
});

// CREATE NEW BLOOD REQUEST
router.post('/', authenticateToken, [
  body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood type'),
  body('location').trim().isLength({ min: 3, max: 100 }).withMessage('Location must be 3-100 chars'),
  body('contact').trim().isLength({ min: 10, max: 50 }).withMessage('Contact must be 10-50 chars'),
  body('urgency').isIn(['low', 'medium', 'high']).withMessage('Invalid urgency level'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description max 500 chars')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });

    const { bloodType, location, contact, urgency, description } = req.body;

    const bloodRequest = new BloodRequest({ userId: req.user._id, bloodType, location, contact, urgency, description });
    await bloodRequest.save();
    await bloodRequest.populate('userId', 'name email phone');

    res.status(201).json({ message: 'Blood request created successfully', request: bloodRequest });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to create blood request' });
  }
});

// GET SPECIFIC BLOOD REQUEST
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const request = await BloodRequest.findOne({ _id: req.params.id, isActive: true })
      .populate('userId', 'name email phone');
    if (!request) return res.status(404).json({ error: 'Blood request not found' });
    res.json({ request });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ error: 'Failed to fetch blood request' });
  }
});

// UPDATE BLOOD REQUEST (creator only)
router.put('/:id', authenticateToken, [
  body('bloodType').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood type'),
  body('location').optional().trim().isLength({ min: 3, max: 100 }),
  body('contact').optional().trim().isLength({ min: 10, max: 50 }),
  body('urgency').optional().isIn(['low', 'medium', 'high']),
  body('description').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });

    const request = await BloodRequest.findOne({ _id: req.params.id, userId: req.user._id, isActive: true });
    if (!request) return res.status(404).json({ error: 'Blood request not found or not authorized' });

    const updates = {};
    const allowedUpdates = ['bloodType', 'location', 'contact', 'urgency', 'description'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updatedRequest = await BloodRequest.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('userId', 'name email phone');

    res.json({ message: 'Blood request updated successfully', request: updatedRequest });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Failed to update blood request' });
  }
});

// DELETE BLOOD REQUEST (soft delete, creator only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const request = await BloodRequest.findOne({ _id: req.params.id, userId: req.user._id, isActive: true });
    if (!request) return res.status(404).json({ error: 'Blood request not found or not authorized' });

    request.isActive = false;
    await request.save();

    res.json({ message: 'Blood request deleted successfully' });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ error: 'Failed to delete blood request' });
  }
});

// MARK BLOOD REQUEST AS FULFILLED (creator only)
router.put('/:id/fulfill', authenticateToken, async (req, res) => {
  try {
    const request = await BloodRequest.findOne({ _id: req.params.id, userId: req.user._id, isActive: true });
    if (!request) return res.status(404).json({ error: 'Blood request not found or not authorized' });

    request.fulfillmentDate = new Date();
    request.isActive = false;
    await request.save();

    res.json({ message: 'Blood request marked as fulfilled successfully', request });
  } catch (error) {
    console.error('Fulfill request error:', error);
    res.status(500).json({ error: 'Failed to fulfill blood request' });
  }
});

export default router;