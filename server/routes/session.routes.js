// server/routes/session.routes.js
const express = require('express');
const router = express.Router();
// const { verifyToken } = require('../middleware/auth.middleware');

// Apply verifyToken middleware to all routes in production
// router.use(verifyToken);

// POST /api/session/log — Telemetry API (STRICTLY no media data)
router.post('/log', (req, res) => res.status(501).json({ message: "Not Implemented" }));

// GET /api/session/weekly — Aggregate last 7 days stats per user
router.get('/weekly', (req, res) => res.status(501).json({ message: "Not Implemented" }));

// GET /api/session/insights — Return peak slouch hour, best day, streak count
router.get('/insights', (req, res) => res.status(501).json({ message: "Not Implemented" }));

module.exports = router;
