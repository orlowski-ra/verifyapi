# 🚀 Railway Deployment - Step by Step

## Your Credentials:
- **Project ID:** `aef55298-a5c0-452f-9b61-96a0fc70f777`
- **API Token:** `a904ee93-d382-4bb5-9855-632733c09e6b`

---

## Option 1: Deploy via Railway Dashboard (Easiest - 2 minutes)

### Step 1: Open Railway Dashboard
Go to: https://railway.com/project/aef55298-a5c0-452f-9b61-96a0fc70f777

### Step 2: Create New Service
1. Click **"New"** button (top right)
2. Select **"Deploy from GitHub repo"**
3. If asked, connect your GitHub account

### Step 3: Upload Code to GitHub First
Since code needs to be on GitHub:

```bash
# 1. Create new repo on GitHub (empty, public or private)
# Go to: https://github.com/new
# Name: verifyapi

# 2. Push code (I'll do this for you):
git remote add origin https://github.com/YOUR_USERNAME/verifyapi.git
git push -u origin master
```

**OR** - Use Railway's "Empty Service" + Manual Deploy:

1. Click **"New"** → **"Empty Service"**
2. Name it: `verifyapi`
3. Go to service settings
4. Under "Source", click "Deploy"
5. Upload the `verifyapi-deploy.tar.gz` file

### Step 4: Configure Environment
1. Click on your new service
2. Go to **"Variables"** tab
3. Add:
   - `PORT` = `3000`
   - `NODE_ENV` = `production`

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your API will be live!

### Step 6: Get Your URL
1. Go to service settings
2. Copy the "Domain" URL
3. Test: `https://your-url.com/api/verify/test@gmail.com`

---

## Option 2: CLI Deployment (If Token Works)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login with token
railway login

# Link to project
railway link --project aef55298-a5c0-452f-9b61-96a0fc70f777

# Deploy
cd verifyapi
railway up
```

---

## Option 3: Render.com (Alternative)

If Railway doesn't work, use Render:

1. Go to https://render.com
2. Click "New Web Service"
3. Connect GitHub repo
4. Select "Docker" runtime
5. Deploy

---

## After Deployment

### Test Your API:
```bash
# Get free API key
curl -X POST https://your-railway-url.com/api/key

# Verify email
curl -H "X-API-Key: va_your_key" \
  https://your-railway-url.com/api/verify/test@example.com
```

### Landing Page:
Your landing page will be at: `https://your-railway-url.com/`

---

## Files Ready for Upload

Location: `/root/.openclaw/workspace/verifyapi/`

Or download: `verifyapi-deploy.tar.gz` (already prepared)

---

## Need Help?

If stuck, tell me which step and I'll help.
