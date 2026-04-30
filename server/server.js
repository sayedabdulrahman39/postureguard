// server/server.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { authLimiter, sessionLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const sessionRoutes = require('./routes/session.routes');
const userRoutes = require('./routes/user.routes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: [process.env.LANDING_PAGE_URL, `chrome-extension://${process.env.EXTENSION_ID}`],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/session', sessionLimiter, sessionRoutes);
app.use('/api/user', userRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
