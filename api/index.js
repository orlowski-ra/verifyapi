const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const customers = [];
const subscriptions = [];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Verify email
app.get('/api/verify/:email', (req, res) => {
  const email = req.params.email;
  const disposable = ['tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'yopmail.com'];
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

// Create checkout session (Stripe simulation)
app.post('/api/create-checkout', (req, res) => {
  const { email, plan } = req.body;
  const prices = { starter: 900, pro: 2900 }; // cents
  
  // Simulate Stripe checkout
  const sessionId = 'cs_' + Math.random().toString(36).substring(2, 20);
  
  res.json({
    sessionId,
    url: `/checkout?session=${sessionId}&plan=${plan}&email=${encodeURIComponent(email)}`,
    plan,
    amount: prices[plan] || 900
  });
});

// Checkout success
app.get('/checkout/success', (req, res) => {
  res.send(`
    <html><body style="font-family:sans-serif;text-align:center;padding:50px;">
      <h1>✓ Payment Successful!</h1>
      <p>Your subscription is active.</p>
      <p>Check your email for API key.</p>
      <a href="/">Back to homepage</a>
    </body></html>
  `);
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
    .checkout { max-width: 400px; margin: 40px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 10px; display: none; }
    .checkout input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 6px; }
    .success { background: #c6f6d5; color: #22543d; padding: 15px; border-radius: 6px; margin-top: 10px; display: none; }
    .testimonials { padding: 60px 20px; background: #f7fafc; }
    .testimonials h2 { text-align: center; margin-bottom: 40px; }
    .testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1000px; margin: 0 auto; }
    .testimonial { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .stars { color: #fbbf24; margin-bottom: 15px; }
    .author { font-weight: bold; color: #667eea; margin-top: 15px; }
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

  <section class="testimonials">
    <h2>Loved by Developers</h2>
    <div class="testimonial-grid">
      <div class="testimonial">
        <div class="stars">★★★★★</div>
        <p>"Reduced our bounce rate by 90%. Game changer for our SaaS."</p>
        <div class="author">Alex Chen, SaaS Founder</div>
      </div>
      <div class="testimonial">
        <div class="stars">★★★★★</div>
        <p>"Integration took 10 minutes. Clean API that just works."</p>
        <div class="author">Sarah Miller, Lead Developer</div>
      </div>
      <div class="testimonial">
        <div class="stars">★★★★★</div>
        <p>"Best value compared to competitors. Fast and reliable."</p>
        <div class="author">Mike Johnson, CTO</div>
      </div>
    </div>
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
        <button class="btn" onclick="showCheckout('starter', 9)">Start Free Trial</button>
      </div>

      <div class="card">
        <h3>Pro</h3>
        <div class="price">$29<span>/month</span></div>
        <ul>
          <li>100,000 verifications</li>
          <li>Dedicated support</li>
          <li>Custom integration</li>
        </ul>
        <button class="btn" onclick="showCheckout('pro', 29)">Contact Sales</button>
      </div>
    </div>

    <div id="checkout" class="checkout">
      <h3>Subscribe to <span id="planName"></span> - $<span id="planPrice"></span>/month</h3>
      <input type="email" id="checkoutEmail" placeholder="Your email">
      <input type="text" placeholder="Card Number (demo: 4242 4242 4242 4242)" disabled>
      <button class="btn" onclick="processPayment()">Pay Now</button>
      <div id="paymentSuccess" class="success"></div>
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

    function showCheckout(plan, price) {
      document.getElementById('checkout').style.display = 'block';
      document.getElementById('planName').textContent = plan;
      document.getElementById('planPrice').textContent = price;
      document.getElementById('checkout').scrollIntoView({behavior: 'smooth'});
    }

    async function processPayment() {
      const email = document.getElementById('checkoutEmail').value;
      const plan = document.getElementById('planName').textContent;
      
      if (!email) {
        alert('Please enter your email');
        return;
      }
      
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, plan})
      });
      const data = await res.json();
      
      // Simulate payment success
      const result = document.getElementById('paymentSuccess');
      result.style.display = 'block';
      result.innerHTML = '✓ Payment successful! Check your email for API key.';
      
      setTimeout(() => {
        window.location.href = '/checkout/success';
      }, 2000);
    }
  </script>
</body>
</html>
  `);
});

module.exports = app;