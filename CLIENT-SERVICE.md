# Client Service Documentation

## Overview

The **Client Service** is a NestJS application that acts as a client-side service to communicate with the API Gateway. It demonstrates how to build a service that consumes microservices through HTTP calls.

## Architecture

```
Client Service (Port 4000)
    ↓ HTTP Request
API Gateway (Port 3000)
    ↓ TCP Message Pattern
Microservices (Port 3001, 3002)
```

## Key Components

### 1. Client Service Module

**File:** `apps/client-service/src/client-service.module.ts`

- Imports `HttpModule` from `@nestjs/axios`
- Configures base URL to point to API Gateway (`http://localhost:3000`)
- Sets timeout for HTTP requests

```typescript
HttpModule.register({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
})
```

### 2. Client Service Service

**File:** `apps/client-service/src/client-service.service.ts`

Contains business logic for making HTTP calls to the API Gateway:

- `getUser(id: number)` - Fetches user data from API Gateway
- `getOrder(id: number)` - Fetches order data from API Gateway

**Key Features:**
- Uses `HttpService` from `@nestjs/axios`
- Converts RxJS Observables to Promises using `firstValueFrom()`
- Error handling for failed requests

### 3. Client Service Controller

**File:** `apps/client-service/src/client-service.controller.ts`

Exposes REST endpoints that internally call the API Gateway:

- `GET /client/user/:id` - Get user by ID
- `GET /client/order/:id` - Get order by ID
- `GET /client/health` - Health check endpoint

## Running the Client Service

### Start All Services (Including Client Service)

```bash
cd /home/pooja/nest-micros/microservices-learning
npm install  # Install @nestjs/axios and axios if not already installed
npm run start:all
```

This will start:
- API Gateway (port 3000)
- User Service (port 3001)
- Order Service (port 3002)
- **Client Service (port 4000)** ← New!

### Start Client Service Individually

```bash
cd /home/pooja/nest-micros/microservices-learning
npx nx serve client-service
```

**Note:** Make sure API Gateway is running first, as Client Service depends on it.

## Testing the Client Service

### 1. Health Check

```bash
curl http://localhost:4000/client/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "client-service"
}
```

### 2. Get User (via Client Service)

```bash
curl http://localhost:4000/client/user/1
```

**Request Flow:**
1. Client Service receives HTTP request
2. Client Service calls API Gateway: `http://localhost:3000/user/1`
3. API Gateway routes to User Service via TCP
4. Response flows back: User Service → API Gateway → Client Service → Client

**Expected Response:**
```json
{
  "id": 1,
  "name": "Pooja",
  "email": "pooja@test.com"
}
```

### 3. Get Order (via Client Service)

```bash
curl http://localhost:4000/client/order/1
```

**Expected Response:**
```json
{
  "id": 1,
  "product": "Laptop",
  "amount": 999.99
}
```

## Comparison: Direct API Gateway vs Client Service

### Direct API Gateway Access

```bash
# Direct call to API Gateway
curl http://localhost:3000/user/1
```

### Via Client Service

```bash
# Call through Client Service
curl http://localhost:4000/client/user/1
```

## Use Cases

The Client Service is useful for:

1. **Service Aggregation**: Combine data from multiple microservices
2. **API Transformation**: Transform API Gateway responses to different formats
3. **Additional Business Logic**: Add validation, caching, or other logic
4. **Client-Side Proxy**: Act as a proxy for frontend applications
5. **Service Mesh Entry Point**: Entry point for service mesh architectures

## Code Examples

### Adding More Endpoints

You can extend the Client Service by adding more methods:

```typescript
// In client-service.service.ts
async getAllUsers() {
  const response = await firstValueFrom(
    this.httpService.get('/users')
  );
  return response.data;
}

// In client-service.controller.ts
@Get('/client/users')
async getAllUsers() {
  return this.clientServiceService.getAllUsers();
}
```

### Adding Error Handling

```typescript
async getUser(id: number) {
  try {
    const response = await firstValueFrom(
      this.httpService.get(`/user/${id}`)
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    throw new InternalServerErrorException('Failed to fetch user');
  }
}
```

### Adding Request/Response Interceptors

```typescript
// In client-service.module.ts
HttpModule.register({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'X-Client-Service': 'client-service',
  },
})
```

## Architecture Benefits

1. **Separation of Concerns**: Client Service handles HTTP client logic separately
2. **Reusability**: Multiple services can use the same client service
3. **Centralized Configuration**: API Gateway URL configured in one place
4. **Error Handling**: Centralized error handling for API Gateway calls
5. **Testing**: Easier to mock and test client interactions

## Port Summary

| Service | Port | Type |
|---------|------|------|
| API Gateway | 3000 | HTTP Server |
| User Service | 3001 | TCP Microservice |
| Order Service | 3002 | TCP Microservice |
| **Client Service** | **4000** | **HTTP Server (Client)** |

## Next Steps

- Add request/response interceptors
- Implement caching layer
- Add authentication/authorization
- Add request logging
- Implement circuit breaker pattern
- Add retry logic for failed requests

