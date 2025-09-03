import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.mjs'; 

const router = express.Router();

// ## REGISTER A NEW USER
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, bloodType, phone, location, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // Create new user instance. The pre-save hook in your model will handle hashing.
    user = new User({ name, email, password, bloodType, phone, location, role });
    
    await user.save();

    // The .toJSON() method in your model automatically removes the password from the response
    res.status(201).json({ msg: 'User registered successfully!', user });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// ## LOGIN A USER
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Use the model's built-in method to compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create the JWT with a consistent payload that middleware expects
    const payload = {
        userId: user.id,
        name: user.name,
        role: user.role
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user }); 
      }
    );

  } catch (err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;

