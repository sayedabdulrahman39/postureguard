// server/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Rate limiting: 100 req/15min per IP on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

// Rate limiting: 500 req/15min on session routes
const sessionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many session requests from this IP, please try again after 15 minutes'
});

module.exports = { authLimiter, sessionLimiter };
