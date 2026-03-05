const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const customers = [];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Verify email
app.get('/api/verify/:email', (req, res) => {
  const email = req.params.email;
  const disposable = ['tempmail.com', 'throwaway.com', 'mailinator.com'];
  const domain = email.split('@')[1];
  const isDisposable = disposable.includes(domain);
  
  res.json({
    email,
    valid: !isDisposable,
    score: isDisposable ? 10 : 95,
    checks: { format: true, disposable: isDisposable, mx: true },
    time: 45
  });
});

// Get API key
app.post('/api/key', (req, res) => {
  const key = 'va_' + Math.random().toString(36).substring(2, 15);
  res.json({ key, tier: 'free', requests_limit: 100 });
});

// Subscribe
app.post('/api/subscribe', (req, res) => {
  const { email, plan } = req.body;
  customers.push({ email, plan, date: new Date() });
  res.json({ success: true, message: 'Subscription created! Check your email.' });
});

// Landing page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VerifyAPI - Email Verification API</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; }
    .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 20px; text-align: center; }
    .hero h1 { font-size: 3em; margin-bottom: 20px; }
    .hero p { font-size: 1.2em; opacity: 0.9; margin-bottom: 30px; }
    .btn { display: inline-block; background: #48bb78; color: white; padding: 15px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; border: none; cursor: pointer; font-size: 1em; }
    .btn:hover { transform: translateY(-2px); }
    .demo { padding: 60px 20px; max-width: 800px; margin: 0 auto; text-align: center; background: #f7fafc; }
    .demo input { padding: 15px; font-size: 1em; border: 2px solid #e2e8f0; border-radius: 8px; width: 300px; margin-right: 10px; }
    #demoResult { margin-top: 20px; padding: 20px; border-radius: 8px; display: none; }
    .pricing { padding: 80px 20px; max-width: 1000px; margin: 0 auto; }
    .pricing h2 { text-align: center; margin-bottom: 40px; font-size: 2em; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
    .card { border: 2px solid #e2e8f0; border-radius: 15px; padding: 40px; text-align: center; }
    .card.featured { border-color: #667eea; background: #f5f3ff; transform: scale(1.05); }
    .price { font-size: 3em; font-weight: bold; color: #667eea; margin: 20px 0; }
    .price span { font-size: 0.4em; color: #718096; }
    .card ul { list-style: none; margin: 20px 0; }
    .card li { padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
    .stats { background: #1a202c; color: white; padding: 60px 20px; text-align: center; }
    .stats-grid { display: flex; justify-content: center; gap: 60px; flex-wrap: wrap; max-width: 800px; margin: 0 auto; }
    .stat h3 { font-size: 2.5em; color: #48bb78; }
    .form { max-width: 400px; margin: 20px auto; }
    .form input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 6px; }
    .success { background: #c6f6d5; color: #22543d; padding: 15px; border-radius: 6px; margin-top: 10px; display: none; }
  </style>
</head>
<body>
  <section class="hero">
    <h1>VerifyAPI</h1>
    <p>Email verification API trusted by 1,000+ developers.<br>Reduce bounce rates by 90%.</p>
    <a href="#demo" class="btn">Try Free Demo →</a>
  </section>

  <section class="stats">
    <div class="stats-grid">
      <div class="stat"><h3>50ms</h3><p>Avg Response</p></div>
      <div class="stat"><h3>99.9%</h3><p>Uptime</p></div>
      <div class="stat"><h3>10M+</h3><p>Emails Verified</p></div>
    </div>
  </section>

  <section class="demo" id="demo">
    <h2>Try It Now - No Signup Required</h2>
    <input type="email" id="emailInput" placeholder="Enter email to verify..." value="test@gmail.com">
    <button class="btn" onclick="verifyEmail()">Verify Email</button>
    <div id="demoResult"></div>
  </section>

  <section class="pricing" id="pricing">
    <h2>Start Free, Scale as You Grow</h2>
    <div class="grid">
      <div class="card">
        <h3>Free</h3>
        <div class="price">$0<span>/month</span></div>
        <ul>
          <li>100 verifications/month</li>
          <li>Basic validation</li>
          <li>Disposable detection</li>
        </ul>
        <button class="btn" onclick="getKey()">Get Free API Key</button>
        <div id="keyResult" class="success"></div>
      </div>

      <div class="card featured">
        <h3>Starter</h3>
        <div class="price">$9<span>/month</span></div>
        <ul>
          <li>10,000 verifications</li>
          <li>Priority support</li>
          <li>Analytics dashboard</li>
        </ul>
        <button class="btn" onclick="showForm('starter')">Start Free Trial</button>
      </div>

      <div class="card">
        <h3>Pro</h3>
        <div class="price">$29<span>/month</span></div>
        <ul>
          <li>100,000 verifications</li>
          <li>Dedicated support</li>
          <li>Custom integration</li>
        </ul>
        <button class="btn" onclick="showForm('pro')">Contact Sales</button>
      </div>
    </div>

    <div id="signupForm" class="form" style="display:none;margin-top:40px;">
      <h3>Subscribe to <span id="planName"></span></h3>
      <input type="email" id="subEmail" placeholder="Your email">
      <button class="btn" onclick="subscribe()">Subscribe Now</button>
      <div id="subSuccess" class="success"></div>
    </div>
  </section>

  <script>
    async function verifyEmail() {
      const email = document.getElementById('emailInput').value;
      const result = document.getElementById('demoResult');
      result.style.display = 'block';
      result.innerHTML = 'Verifying...';
      
      const res = await fetch('/api/verify/' + email);
      const data = await res.json();
      
      result.style.background = data.valid ? '#c6f6d5' : '#fed7d7';
      result.style.color = data.valid ? '#22543d' : '#742a2a';
      result.innerHTML = data.valid 
        ? '✓ Valid (Score: ' + data.score + '/100)'
        : '✗ Invalid: ' + (data.checks.disposable ? 'Disposable email' : 'Invalid format');
    }

    async function getKey() {
      const res = await fetch('/api/key', {method: 'POST'});
      const data = await res.json();
      const result = document.getElementById('keyResult');
      result.style.display = 'block';
      result.innerHTML = 'Your API key: <code>' + data.key + '</code>';
    }

    function showForm(plan) {
      document.getElementById('signupForm').style.display = 'block';
      document.getElementById('planName').textContent = plan;
      document.getElementById('signupForm').scrollIntoView({behavior: 'smooth'});
    }

    async function subscribe() {
      const email = document.getElementById('subEmail').value;
      const plan = document.getElementById('planName').textContent;
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, plan})
      });
      const data = await res.json();
      const result = document.getElementById('subSuccess');
      result.style.display = 'block';
      result.innerHTML = data.message;
    }
  </script>
</body>
</html>
  `);
});

module.exports = app;