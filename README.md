# VerifyAPI

Email verification API service - fast, accurate, and developer-friendly.

## Features

- ✨ **Format Validation** - Check if email follows proper format
- 🛡️ **Disposable Detection** - Block temporary email addresses
- ✅ **MX Validation** - Verify domain can receive emails
- 🔍 **SMTP Verification** - Check if mailbox exists (optional)
- 📊 **Scoring** - Get confidence score for each email
- ⚡ **Fast** - Sub-100ms response times
- 💰 **Affordable** - Start free, scale as you grow

## Quick Start

### 1. Get API Key

```bash
curl -X POST https://api.verifyapi.com/api/key
```

Response:
```json
{
  "key": "va_xxxxxxxxxxxx",
  "tier": "free",
  "requests_limit": 100
}
```

### 2. Verify an Email

```bash
curl -H "X-API-Key: va_your_key" \
  https://api.verifyapi.com/api/verify/user@example.com
```

Response:
```json
{
  "email": "user@example.com",
  "valid": true,
  "score": 95,
  "checks": {
    "format": true,
    "disposable": false,
    "mx": true,
    "smtp": true
  },
  "time": 45
}
```

### 3. Bulk Verification

```bash
curl -X POST https://api.verifyapi.com/api/verify/bulk \
  -H "X-API-Key: va_your_key" \
  -H "Content-Type: application/json" \
  -d '{"emails": ["test1@example.com", "test2@example.com"]}'
```

## Pricing

| Tier | Price | Requests | Features |
|------|-------|----------|----------|
| Free | $0 | 100/month | Basic validation |
| Starter | $9 | 10,000/month | MX + SMTP |
| Pro | $29 | 100,000/month | All features |

## Deployment

### Local Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Start server
npm run dev
```

### Production (Docker)

```bash
# Build and run
docker-compose up -d

# Or manually
docker build -t verifyapi .
docker run -p 3000:3000 --env-file .env verifyapi
```

### Production (Railway/Render)

1. Push code to GitHub
2. Connect Railway/Render to repo
3. Add environment variables
4. Deploy

## Environment Variables

```bash
PORT=3000                                    # Server port
NODE_ENV=production                          # Environment
ENABLE_SMTP_CHECK=true                       # Enable SMTP verification
```

## API Endpoints

### GET /api/verify/:email
Verify a single email address.

**Headers:**
- `X-API-Key` - Your API key

**Response:**
```json
{
  "email": "string",
  "valid": boolean,
  "score": number,
  "checks": {
    "format": boolean,
    "disposable": boolean,
    "mx": boolean,
    "smtp": boolean
  },
  "reason": "string",
  "time": number
}
```

### POST /api/verify/bulk
Verify up to 100 emails at once.

**Body:**
```json
{
  "emails": ["email1@example.com", "email2@example.com"]
}
```

### GET /api/stats
Get usage statistics.

**Response:**
```json
{
  "usage": {
    "used": 45,
    "limit": 100,
    "remaining": 55
  }
}
```

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad request |
| 401 | Invalid API key |
| 429 | Rate limit exceeded |
| 500 | Server error |

## Client Libraries

### JavaScript
```javascript
const verifyapi = require('verifyapi');

const client = new verifyapi('va_your_key');
const result = await client.verify('user@example.com');
```

### Python
```python
from verifyapi import Client

client = Client('va_your_key')
result = client.verify('user@example.com')
```

## Testing

```bash
npm test
```

## License

MIT
