import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// Format user response
const formatUserResponse = (user, token) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: token
  };
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id);
      return res.status(201).json(formatUserResponse(user, token));
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    return res.status(200).json(formatUserResponse(user, token));
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ message: 'Server error while retrieving profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new email already exists (if email is being updated)
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user fields if provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    // Handle password update with verification
    if (req.body.password) {
      // Verify current password if attempting to change password
      if (!req.body.currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      
      const isMatch = await user.comparePassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      // Validate new password
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      
      // Confirm new password matches confirmation
      if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: 'New password and confirmation do not match' });
      }
      
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const token = generateToken(updatedUser._id);

    return res.status(200).json(formatUserResponse(updatedUser, token));
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Server error while updating profile' });
  }
};
