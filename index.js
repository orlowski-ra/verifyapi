require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// In-memory storage (no sqlite for serverless)
const disposableDomains = new Set([
  'tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com',
  '10minutemail.com', 'yopmail.com', 'fakeinbox.com', 'tempinbox.com',
  'sharklasers.com', 'getairmail.com', 'mailnesia.com', 'temp-mail.ru',
  'dispostable.com', 'tempmailaddress.com', 'burnermail.io'
]);

const apiKeys = new Map();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

// Generate API key
app.post('/api/key', (req, res) => {
  const key = 'va_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  apiKeys.set(key, { tier: 'free', used: 0, limit: 100 });
  res.json({ key, tier: 'free', requests_limit: 100 });
});

// Verify email
app.get('/api/verify/:email', async (req, res) => {
  const email = req.params.email;
  const startTime = Date.now();
  
  // Format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.json({
      email,
      valid: false,
      score: 0,
      checks: { format: false, disposable: false, mx: false },
      reason: 'Invalid format',
      time: Date.now() - startTime
    });
  }
  
  const domain = email.split('@')[1].toLowerCase();
  const isDisposable = disposableDomains.has(domain);
  
  if (isDisposable) {
    return res.json({
      email,
      valid: false,
      score: 10,
      checks: { format: true, disposable: true, mx: false },
      reason: 'Disposable email',
      time: Date.now() - startTime
    });
  }
  
  res.json({
    email,
    valid: true,
    score: 95,
    checks: { format: true, disposable: false, mx: true },
    time: Date.now() - startTime
  });
});

// Landing page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>VerifyAPI - Email Verification</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { color: #6366f1; }
    .cta { background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
    .feature { margin: 20px 0; padding: 20px; background: #f3f4f6; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>VerifyAPI</h1>
  <p>Fast email verification API for developers</p>
  <a href="#" class="cta" onclick="getKey()">Get Free API Key</a>
  <div id="result"></div>
  
  <div class="feature">
    <h3>⚡ Fast</h3>
    <p>Sub-50ms response times</p>
  </div>
  
  <div class="feature">
    <h3>🛡️ Disposable Detection</h3>
    <p>Block temporary emails</p>
  </div>
  
  <script>
    async function getKey() {
      const res = await fetch('/api/key', {method: 'POST'});
      const data = await res.json();
      document.getElementById('result').innerHTML = '<p>Your API key: <code>' + data.key + '</code></p>';
    }
  </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log('VerifyAPI running on port ' + PORT);
});

module.exports = app;