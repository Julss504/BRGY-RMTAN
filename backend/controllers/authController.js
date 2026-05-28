const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { email, password, fullName, contactNumber } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const user = new User({ email, password, fullName, contactNumber });
    await user.save();
    
    res.status(201).json({ message: 'Registration successful. Waiting for admin approval.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    if (user.status !== 'approved') {
      return res.status(403).json({ message: 'Account not approved' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });
    
    // Include profile completion status
    const ResidentProfile = require('../models/ResidentProfile');
    const profile = await ResidentProfile.findOne({ userId: user._id });
    
    res.json({ 
      user: { 
        id: user._id, 
        email: user.email, 
        fullName: user.fullName, 
        role: user.role,
        status: user.status,
        profileCompleted: profile?.profileCompleted || false
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // In production, send email with reset link
    // For demo, just return success
    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const ResidentProfile = require('../models/ResidentProfile');
    const profile = await ResidentProfile.findOne({ userId: user._id });
    res.json({
      ...user.toObject(),
      profileCompleted: profile?.profileCompleted || false
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status, denyReason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create notification for the user
    const Notification = require('../models/Notification');
    await Notification.create({
      userId: user._id,
      message: status === 'approved' 
        ? 'Your registration has been approved! You can now log in.' 
        : `Your registration has been denied. Reason: ${denyReason || 'Please contact barangay office'}`,
      type: 'system'
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, logout, getMe, getAllUsers, updateUserStatus, forgotPassword };