# Deployment Guide

## Option 1: Railway (Recommended)

Railway offers free hosting with:
- 500 hours/month (enough for 24/7 operation)
- Automatic deployments from GitHub
- Custom domains
- Easy scaling

### Steps:

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/verifyapi.git
git push -u origin main
```

2. **Create Railway Account**
- Go to https://railway.app
- Sign up with GitHub
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your verifyapi repository

3. **Deploy**
- Railway will automatically detect the Dockerfile
- Click "Deploy"
- Wait for deployment (2-3 minutes)

4. **Get URL**
- Railway will provide a URL like `verifyapi-production.up.railway.app`
- Your API is now live!

5. **Custom Domain (Optional)**
- Go to Settings > Domains
- Add your custom domain
- Configure DNS

**Cost:** Free tier is sufficient for starting

---

## Option 2: Render

Render also offers free hosting:
- 750 hours/month
- Automatic HTTPS
- Easy deployment

### Steps:

1. **Push to GitHub** (same as above)

2. **Create Render Account**
- Go to https://render.com
- Sign up with GitHub
- Click "New Web Service"
- Connect your repository

3. **Configure**
- Name: verifyapi
- Runtime: Docker
- Branch: main
- Plan: Free

4. **Deploy**
- Click "Create Web Service"
- Render will build and deploy automatically

**Cost:** Free tier is sufficient

---

## Option 3: VPS (DigitalOcean, Hetzner, etc.)

For full control and lower long-term costs.

### Requirements:
- 1 CPU, 1GB RAM minimum
- Docker installed

### Steps:

```bash
# On your VPS
sudo apt update
sudo apt install docker.io docker-compose

# Clone repository
git clone https://github.com/yourusername/verifyapi.git
cd verifyapi

# Start with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f
```

**Cost:** $5-10/month

---

## Post-Deployment

### 1. Test the API

```bash
# Get API key
curl -X POST https://your-domain.com/api/key

# Test verification
curl -H "X-API-Key: va_your_key" \
  https://your-domain.com/api/verify/test@example.com
```

### 2. Set up Monitoring (Optional)

Use UptimeRobot (free) to monitor your API:
- Add monitor: https://your-domain.com/health
- Get alerts if API goes down

### 3. Configure Custom Domain

Add your domain to the hosting platform and configure DNS:
- Create A record pointing to server IP
- Or CNAME for Railway/Render domains

### 4. SSL Certificate

Railway and Render provide SSL automatically.
For VPS, use Let's Encrypt:
```bash
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

---

## Monetization Setup

Once deployed, set up Stripe for payments:

1. Create Stripe account at https://stripe.com
2. Get API keys
3. Add to environment variables
4. Create checkout page
5. Connect to API key generation

**Note:** Payment integration requires additional code for production use.

---

## Next Steps

1. ✅ Deploy the API
2. ✅ Test with a few requests
3. ⏳ Add payment integration (Stripe)
4. ⏳ Create marketing materials
5. ⏳ Submit to API directories (RapidAPI, etc.)
6. ⏳ Write blog posts about email verification

---

**Time to first $:** 
- Free tier users: $0 (but builds user base)
- First paid customer: 1-3 months
- Consistent revenue: 3-6 months

**Estimated earnings:**
- 10 paid customers × $9/month = $90/month
- 50 paid customers × $9/month = $450/month
- 100 paid customers × $9/month = $900/month
