# How to Start the UI Service (Port 4000)

## Quick Start

### Option 1: Start All Services Together (Recommended)

This starts API Gateway, User Service, Order Service, and UI Service:

```bash
cd /home/pooja/nest-micros/microservices-learning
npm install  # Install dependencies if not already done
npm run start:all
```

This will start all 4 services:
- API Gateway on port 3000
- User Service on port 3001
- Order Service on port 3002
- **UI Service on port 4000** ✅

### Option 2: Start UI Service Only

If other services are already running, start just the UI service:

**Using NestJS CLI:**
```bash
cd /home/pooja/nest-micros/microservices-learning
nest start client-service --watch
```

**Or using ts-node directly:**
```bash
cd /home/pooja/nest-micros/microservices-learning/apps/client-service
npx ts-node src/main.ts
```

**Or build and run:**
```bash
cd /home/pooja/nest-micros/microservices-learning
nest build client-service
node dist/apps/client-service/main.js
```

### Option 3: Start Services Individually (4 Terminals)

**Terminal 1 - API Gateway:**
```bash
cd /home/pooja/nest-micros/microservices-learning
npx nx serve api-gateway
```

**Terminal 2 - User Service:**
```bash
cd /home/pooja/nest-micros/microservices-learning
npx nx serve user-service
```

**Terminal 3 - Order Service:**
```bash
cd /home/pooja/nest-micros/microservices-learning
npx nx serve order-service
```

**Terminal 4 - UI Service:**
```bash
cd /home/pooja/nest-micros/microservices-learning
npx nx serve client-service
```

## Accessing the UI

Once the UI service is running, open your browser and go to:

```
http://localhost:4000
```

You should see the **Microservices Dashboard** with:
- User Service section
- Order Service section
- Input fields and buttons to interact with services

## Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Make sure API Gateway is running** (port 3000)
   - The UI service calls the API Gateway
   - Without it, the UI won't be able to fetch data

## Verification

Check if the service is running:
```bash
# Check port 4000
lsof -i :4000
# or
curl http://localhost:4000
```

You should see the HTML page or get a 200 response.

## Troubleshooting

### Port 4000 Already in Use

```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill <PID>
```

### UI Service Not Loading

1. Check if API Gateway is running on port 3000
2. Check browser console for errors (F12)
3. Verify all dependencies are installed: `npm install`

### Cannot Connect to API Gateway

Make sure:
- API Gateway is running: `curl http://localhost:3000/user/1`
- UI service can reach the API Gateway (check network/firewall)

