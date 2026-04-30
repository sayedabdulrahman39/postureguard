# PostureGuard

Privacy-first Chrome Extension that uses on-device Computer Vision to detect slouching and enforces correction via a Force-Feedback blur mechanism.

## Monorepo Structure

```text
/
├── extension/      # Chrome Extension (Manifest V3)
├── server/         # Node.js Express Backend
└── landing/        # React + Vite Landing Page
```

## Local Development Setup

### 1. Landing Page
```bash
cd landing
npm install
npm run dev
```
The landing page will run on `http://localhost:5173`.

### 2. Backend Server
```bash
cd server
npm install
cp .env.example .env
# Edit .env to add your MongoDB URI and Keys
npm run dev # or node server.js
```
The server will run on `http://localhost:3000`.

### 3. Chrome Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner.
3. Click "Load unpacked".
4. Select the `extension/` directory.

## Backend To-Do Checklist

**Authentication**
- [ ] `POST /api/auth/signup` — hash password with bcrypt (salt rounds: 12), return JWT
- [ ] `POST /api/auth/login` — validate credentials, issue access token (15min) + refresh token (7d)
- [ ] `POST /api/auth/refresh` — rotate JWT using refresh token
- [ ] `POST /api/auth/logout` — invalidate refresh token in DB
- [ ] Middleware: `verifyToken.js` — protect all `/api/session` and `/api/user` routes

**Telemetry API (STRICTLY no media data)**
- [ ] `POST /api/session/log` — Accept payload:
  ```json
  {
    "userId": "string",
    "date": "ISO8601",
    "durationMinutes": "number",
    "slouchCount": "number",
    "slouchDurationSeconds": "number",
    "accuracyPercent": "number",
    "blurTriggerCount": "number"
  }
  ```
- [ ] `GET /api/session/weekly` — Aggregate last 7 days stats per user
- [ ] `GET /api/session/insights` — Return peak slouch hour, best day, streak count

**User Settings Sync**
- [ ] `GET/PUT /api/user/settings` — Sync: sensitivity threshold, blur intensity, break timer interval, active profile ID
- [ ] `POST /api/user/profile` — Create named profile (e.g., "Home", "Kid - Arjun")
- [ ] `DELETE /api/user/profile/:id`

**Security Implementation**
- [ ] Rate limiting: 100 req/15min per IP on auth routes, 500 req/15min on session routes
- [ ] Helmet.js for HTTP security headers
- [ ] AES-256-GCM encryption for all PII fields in MongoDB
- [ ] Input validation via Zod or Joi on all endpoints
- [ ] CORS whitelist: only extension origin + landing page domain

**Webcam Conflict Handler**
- [ ] Background service worker logic implemented in `extension/background/service-worker.js`.
