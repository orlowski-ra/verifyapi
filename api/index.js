const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'verifyapi' });
});

// Verify email endpoint
app.get('/api/verify/:email', (req, res) => {
  const email = req.params.email;
  const disposableDomains = ['tempmail.com', 'throwaway.com', 'mailinator.com'];
  const domain = email.split('@')[1];
  
  res.json({
    email,
    valid: !disposableDomains.includes(domain),
    score: disposableDomains.includes(domain) ? 10 : 95,
    checks: {
      format: true,
      disposable: disposableDomains.includes(domain)
    }
  });
});

// Generate API key
app.post('/api/key', (req, res) => {
  const key = 'va_' + Math.random().toString(36).substring(2, 15);
  res.json({ key, tier: 'free', requests_limit: 100 });
});

// Landing page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head><title>VerifyAPI</title></head>
<body>
  <h1>VerifyAPI - Email Verification</h1>
  <p>Fast email verification API</p>
  <button onclick="getKey()">Get Free API Key</button>
  <div id="result"></div>
  <script>
    async function getKey() {
      const res = await fetch('/api/key', {method: 'POST'});
      const data = await res.json();
      document.getElementById('result').innerHTML = 'Key: ' + data.key;
    }
  </script>
</body>
</html>
  `);
});

module.exports = app;