const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAuthToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'dayflow_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const generateCryptoToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = {
  generateAuthToken,
  generateCryptoToken,
};
