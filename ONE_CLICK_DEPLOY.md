# 🚀 ONE-CLICK DEPLOYMENT GUIDE

## VerifyAPI - Deploy in 5 Minutes

### Option 1: Render (Recommended - Free Forever)

**Step 1:** Click this button
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/orlowski-ra/verifyapi)

**Step 2:** Create free Render account (GitHub login)

**Step 3:** Done! Your API is live at `https://verifyapi-[random].onrender.com`

---

### Option 2: Railway (Free Tier)

**Step 1:** Go to https://railway.app

**Step 2:** Click "New Project" → "Deploy from GitHub repo"

**Step 3:** Select `orlowski-ra/verifyapi`

**Step 4:** Railway auto-detects Dockerfile and deploys

---

### Option 3: Vercel (Serverless)

**Step 1:** Go to https://vercel.com/new

**Step 2:** Import `orlowski-ra/verifyapi`

**Step 3:** Framework preset: Other

**Step 4:** Deploy

---

## Environment Variables

No configuration needed for basic operation.

Optional:
- `NODE_ENV=production`
- `PORT=3000` (auto-set by platform)

---

## Test Your Deployment

```bash
# Get API key
curl -X POST https://your-domain.com/api/key

# Verify email
curl https://your-domain.com/api/verify/test@example.com
```

---

## Payment Integration (Optional)

To add Stripe payments:
1. Create Stripe account
2. Add webhook endpoint
3. Connect to API key generation

---

## Status

- ✅ Code: Ready
- ✅ Dockerfile: Ready
- ✅ render.yaml: Ready
- ⏳ Deployment: Awaiting one-click activation

**Time to deploy:** 2 minutes
**Cost:** $0 (free tier)
