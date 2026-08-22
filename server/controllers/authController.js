const User = require('../models/User');
const { generateAuthToken, generateCryptoToken } = require('../utils/generateToken');

// @desc    Register a new user (Sign Up)
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { employeeId, name, email, password, confirmPassword, role } = req.body;

    // 1. Validation
    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Employee ID, Name, Email, and Password.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and Confirm Password do not match.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // 2. Duplicate Checks
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const existingEmployeeId = await User.findOne({ employeeId: employeeId.toUpperCase().trim() });
    if (existingEmployeeId) {
      return res.status(409).json({
        success: false,
        message: 'This Employee ID is already assigned to another user.',
      });
    }

    // 3. Email Verification Token Generation
    const emailVerificationToken = generateCryptoToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // 4. Create User
    const userRole = role && ['admin', 'hr', 'employee'].includes(role.toLowerCase()) ? role.toLowerCase() : 'employee';

    const user = await User.create({
      employeeId: employeeId.toUpperCase().trim(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires,
    });

    const token = generateAuthToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully. Please verify your email.',
      token,
      user: user.toAuthJSON(),
      emailVerificationToken, // Provided for direct verification testing
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

// @desc    Authenticate user & get token (Sign In)
// @route   POST /api/auth/signin
// @access  Public
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Find user and explicitly select password hash
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateAuthToken(user._id);

    return res.json({
      success: true,
      message: 'Successfully signed in.',
      token,
      user: user.toAuthJSON(),
    });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
    });
  }
};

// @desc    Verify email address using token
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is invalid or has expired.',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    return res.json({
      success: true,
      message: 'Your email has been verified successfully!',
      user: user.toAuthJSON(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during email verification.',
    });
  }
};

// @desc    Resend verification token
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified.' });
    }

    const newToken = generateCryptoToken();
    user.emailVerificationToken = newToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    return res.json({
      success: true,
      message: 'A new verification link has been generated.',
      emailVerificationToken: newToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error resending verification.' });
  }
};

// @desc    Request password reset token (Forgot Password)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your work email address.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    // Always return success message to avoid email enumeration
    const genericResponse = {
      success: true,
      message: 'If an account with that email exists, password reset instructions have been sent.',
    };

    if (!user) {
      return res.json(genericResponse);
    }

    const resetToken = generateCryptoToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    await user.save();

    return res.json({
      ...genericResponse,
      resetToken, // Returned for instant development/testing UI navigation
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error processing forgot password.' });
  }
};

// @desc    Reset password using reset token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password and confirm password do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired.',
      });
    }

    // Set new password (pre-save hook will hash it)
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: 'Server error resetting password.' });
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user.toAuthJSON(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching user profile.' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  return res.json({
    success: true,
    message: 'User logged out successfully.',
  });
};

module.exports = {
  signup,
  signin,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout,
};
