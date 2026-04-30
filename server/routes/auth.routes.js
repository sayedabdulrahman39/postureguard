// server/routes/auth.routes.js
const express = require('express');
const router = express.Router();
// const authController = require('../controllers/auth.controller');

// POST /api/auth/signup — hash password with bcrypt (salt rounds: 12), return JWT
router.post('/signup', (req, res) => res.status(501).json({ message: "Not Implemented" }));

// POST /api/auth/login — validate credentials, issue access token (15min) + refresh token (7d)
router.post('/login', (req, res) => res.status(501).json({ message: "Not Implemented" }));

// POST /api/auth/refresh — rotate JWT using refresh token
router.post('/refresh', (req, res) => res.status(501).json({ message: "Not Implemented" }));

// POST /api/auth/logout — invalidate refresh token in DB
router.post('/logout', (req, res) => res.status(501).json({ message: "Not Implemented" }));

module.exports = router;
