# Microservices Testing Guide

## Architecture Overview

- **API Gateway**: Port 3000 (HTTP server)
- **User Service**: Port 3001 (TCP microservice)
- **Order Service**: Port 3002 (TCP microservice)

## Starting the Services

### Option 1: Start All Services (Recommended)

```bash
cd /home/pooja/nest-micros/microservices-learning
npm run start:all
```

### Option 2: Start Services Individually (in separate terminals)

**Terminal 1 - API Gateway:**
```bash
cd /home/pooja/nest-micros/microservices-learning
npx nx serve api-gateway
# or
npm run start:dev -- api-gateway
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

## Testing Endpoints

Once all services are running, test the endpoints:

### 1. Get User by ID

```bash
curl http://localhost:3000/user/1
```

**Expected Response:**
```json
{
  "id": 1,
  "name": "Pooja",
  "email": "pooja@test.com"
}
```

### 2. Get Order by ID

```bash
curl http://localhost:3000/order/1
```

**Expected Response:**
```json
{
  "id": 1,
  "product": "Laptop",
  "amount": 999.99
}
```

## Testing with Browser

You can also test directly in your browser:

- User Service: http://localhost:3000/user/1
- Order Service: http://localhost:3000/order/1

## Testing with Postman/Thunder Client

1. Create a new GET request
2. URL: `http://localhost:3000/user/1` or `http://localhost:3000/order/1`
3. Send the request

## Verification Steps

1. **Check API Gateway is running:**
   ```bash
   curl http://localhost:3000/user/1
   ```

2. **Verify ports are listening:**
   ```bash
   lsof -i :3000 -i :3001 -i :3002
   ```

3. **Check service logs** - Each service should print:
   - API Gateway: "API Gateway running on port 3000"
   - User Service: "User Microservice running on port 3001"
   - Order Service: "Order Microservice running on port 3002"

## Troubleshooting

### Port Already in Use

If you get "port already in use" error:
```bash
# Find and kill the process
lsof -i :3000  # or :3001, :3002
kill <PID>
```

### Services Not Communicating

1. Ensure all three services are running
2. Check that ports match:
   - API Gateway connects to User Service on port 3001
   - API Gateway connects to Order Service on port 3002
3. Verify TCP connections are established

### Service Not Starting

1. Check for TypeScript errors:
   ```bash
   npx nx build <service-name>
   ```
2. Check logs in the terminal where the service is running
3. Verify dependencies are installed:
   ```bash
   npm install
   ```

