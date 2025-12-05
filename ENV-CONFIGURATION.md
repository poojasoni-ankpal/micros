# Environment Configuration Guide

## Overview

All services now read configuration from environment variables via `.env` file. This centralizes all URLs and ports in one place.

## Setup

### 1. Create .env File

Copy the example file:
```bash
cp .env.example .env
```

Or create `.env` manually in the root directory with:

```env
# MongoDB Database Connection
MONGODB_URI=xxx

# Service Ports
API_GATEWAY_PORT=3000
USER_SERVICE_PORT=3001
ORDER_SERVICE_PORT=3002
CLIENT_SERVICE_PORT=4000

# API Gateway URL (used by client service to connect to API Gateway)
API_GATEWAY_URL=http://localhost:3000
```

## Configuration Details

### Environment Variables

| Variable | Description | Default | Used By |
|----------|-------------|---------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | (hardcoded fallback) | User Service, Order Service |
| `API_GATEWAY_PORT` | Port for API Gateway HTTP server | 3000 | API Gateway |
| `USER_SERVICE_PORT` | Port for User microservice (TCP) | 3001 | User Service, API Gateway |
| `ORDER_SERVICE_PORT` | Port for Order microservice (TCP) | 3002 | Order Service, API Gateway |
| `CLIENT_SERVICE_PORT` | Port for UI/Client service | 4000 | Client Service |
| `API_GATEWAY_URL` | Full URL of API Gateway | http://localhost:3000 | Client Service |

## Where Each Service Reads Configuration

### 1. API Gateway (`apps/api-gateway/`)

**Port:**
```typescript
// main.ts
const port = configService.get<number>('API_GATEWAY_PORT') || 3000;
```

**Microservice Ports:**
```typescript
// api-gateway.module.ts
port: configService.get<number>('USER_SERVICE_PORT') || 3001,
port: configService.get<number>('ORDER_SERVICE_PORT') || 3002,
```

### 2. User Service (`apps/user-service/`)

**Port:**
```typescript
// main.ts
port: configService.get<number>('USER_SERVICE_PORT') || 3001,
```

**MongoDB URI:**
```typescript
// user-service.module.ts
uri: configService.get<string>('MONGODB_URI') || 'fallback...'
```

### 3. Order Service (`apps/order-service/`)

**Port:**
```typescript
// main.ts
port: configService.get<number>('ORDER_SERVICE_PORT') || 3002,
```

**MongoDB URI:**
```typescript
// order-service.module.ts
uri: configService.get<string>('MONGODB_URI') || 'fallback...'
```

### 4. Client Service (`apps/client-service/`)

**Port:**
```typescript
// main.ts
const port = configService.get<number>('CLIENT_SERVICE_PORT') || 4000;
```

**API Gateway URL:**
```typescript
// client-service.service.ts
this.apiGatewayUrl = 
  this.configService.get<string>('API_GATEWAY_URL') || 
  'http://localhost:3000';
```

**Frontend (app.js):**
```javascript
// Fetches from /api/config endpoint which reads from ConfigService
fetch('/api/config')
  .then(res => res.json())
  .then(config => {
    API_BASE = `${config.apiGatewayUrl}/api`;
  });
```

## Usage

### Development

1. Create `.env` file in root directory
2. Add all required variables
3. Start services - they will automatically read from `.env`

### Production

Set environment variables in your hosting platform:
- Heroku: `heroku config:set MONGODB_URI=...`
- Docker: Use `-e` flag or `.env` file
- Kubernetes: Use ConfigMaps or Secrets

## Benefits

✅ **Single source of truth** - All config in one place
✅ **Environment-specific** - Different `.env` files for dev/staging/prod
✅ **Security** - Sensitive data (passwords) not in code
✅ **Easy deployment** - Change ports/URLs without code changes
✅ **Team collaboration** - Share `.env.example`, keep actual `.env` private

## Notes

- `.env` file is in `.gitignore` - never commit it to Git
- `.env.example` is committed - serves as template
- Services fall back to hardcoded defaults if env vars not found
- Frontend JavaScript fetches API URL dynamically from backend

## Testing Configuration

Check if config is loaded correctly:

```bash
# API Gateway health (if you add it)
curl http://localhost:3000/api/health

# Client Service config endpoint
curl http://localhost:4000/api/config
```

You should see the configured URLs in the response.

