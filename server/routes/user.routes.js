// server/routes/user.routes.js
const express = require('express');
const router = express.Router();
// const { verifyToken } = require('../middleware/auth.middleware');

// Apply verifyToken middleware to all routes in production
// router.use(verifyToken);

// GET /api/user/settings — Sync: sensitivity threshold, blur intensity, break timer interval, active profile ID
router.get('/settings', (req, res) => res.status(501).json({ message: "Not Implemented" }));

// PUT /api/user/settings
router.put('/settings', (req, res) => res.status(501).json({ message: "Not Implemented" }));

// POST /api/user/profile — Create named profile (e.g., "Home", "Kid - Arjun")
router.post('/profile', (req, res) => res.status(501).json({ message: "Not Implemented" }));

// DELETE /api/user/profile/:id
router.delete('/profile/:id', (req, res) => res.status(501).json({ message: "Not Implemented" }));

module.exports = router;
