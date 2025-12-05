# Microservices Communication Architecture

## Overview

The microservices communicate using **NestJS Microservices** pattern-based messaging over **TCP transport**.

## Communication Flow

```
Client (Browser/Postman)
    ↓ HTTP Request
API Gateway (Port 3000 - HTTP Server)
    ↓ TCP + Message Pattern
User Service (Port 3001 - TCP Microservice)
    ↓ TCP + Message Pattern  
Order Service (Port 3002 - TCP Microservice)
```

## Architecture Details

### 1. API Gateway - HTTP Entry Point

The API Gateway is a **hybrid application**:
- **HTTP Server** to receive REST requests from clients
- **TCP Client** to send messages to microservices

**Code Reference:**
```12:14:microservices-learning/apps/api-gateway/src/api-gateway.controller.ts
  @Get('/user/:id')
  async getUser(@Param('id') id: string) {
    return lastValueFrom(this.userClient.send({ cmd: 'get_user' }, { id: Number(id) }));
```

### 2. Client Registration - TCP Connection Setup

The API Gateway registers TCP clients for each microservice:

```7:18:microservices-learning/apps/api-gateway/src/api-gateway.module.ts
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { port: 3001 },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: { port: 3002 },
      },
    ]),
```

### 3. Message Pattern-Based Communication

#### Sending Messages (API Gateway → Microservice)

The API Gateway sends messages using **pattern-based routing**:

```14:14:microservices-learning/apps/api-gateway/src/api-gateway.controller.ts
    return lastValueFrom(this.userClient.send({ cmd: 'get_user' }, { id: Number(id) }));
```

**Key Components:**
- `this.userClient.send()` - Sends message via TCP
- `{ cmd: 'get_user' }` - **Message pattern** (routing key)
- `{ id: Number(id) }` - **Payload/data** to send
- `lastValueFrom()` - Converts RxJS Observable to Promise

#### Receiving Messages (Microservice)

Microservices listen for messages matching specific patterns:

```6:9:microservices-learning/apps/user-service/src/user-service.controller.ts
  @MessagePattern({ cmd: 'get_user' })
  getUser(data: { id: number }) {
    return { id: data.id, name: 'Pooja', email: 'pooja@test.com' };
  }
```

**Key Components:**
- `@MessagePattern({ cmd: 'get_user' })` - **Pattern matcher** decorator
- The pattern must **exactly match** what the client sends
- The handler receives the payload and returns a response

## Transport Layer: TCP

### TCP Configuration

**API Gateway (Client):**
```7:17:microservices-learning/apps/api-gateway/src/api-gateway.module.ts
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { port: 3001 },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: { port: 3002 },
      },
    ]),
```

**User Service (Server):**
```6:9:microservices-learning/apps/user-service/src/main.ts
  const app = await NestFactory.createMicroservice(UserServiceModule, {
    transport: Transport.TCP,
    options: { port: 3001 },
  });
```

## Complete Communication Example

### Step-by-Step Flow

1. **Client makes HTTP request:**
   ```
   GET http://localhost:3000/user/1
   ```

2. **API Gateway receives HTTP request:**
   ```typescript
   @Get('/user/:id')
   async getUser(@Param('id') id: string) {
     // id = "1"
   }
   ```

3. **API Gateway sends TCP message:**
   ```typescript
   this.userClient.send({ cmd: 'get_user' }, { id: 1 })
   ```
   - Opens TCP connection to `localhost:3001`
   - Sends message with pattern `{ cmd: 'get_user' }`
   - Includes payload `{ id: 1 }`

4. **User Service receives TCP message:**
   ```typescript
   @MessagePattern({ cmd: 'get_user' })
   getUser(data: { id: number }) {
     // data = { id: 1 }
     return { id: 1, name: 'Pooja', email: 'pooja@test.com' };
   }
   ```
   - Pattern matches: `{ cmd: 'get_user' }`
   - Handler executes with payload
   - Returns response data

5. **Response flows back:**
   - User Service → API Gateway (via TCP)
   - API Gateway → Client (via HTTP)
   - Client receives: `{"id":1,"name":"Pooja","email":"pooja@test.com"}`

## Key Concepts

### 1. Pattern-Based Routing

Messages are routed based on **patterns**, not URLs:
- Pattern: `{ cmd: 'get_user' }`
- Pattern: `{ cmd: 'get_order' }`
- Patterns can be any object structure

### 2. Request-Response Pattern

- **Synchronous**: Client waits for response
- Uses `client.send()` for request-response
- Alternative: `client.emit()` for fire-and-forget

### 3. Observable to Promise

Microservice clients return RxJS Observables:
```typescript
this.userClient.send(...) // Returns Observable
lastValueFrom(...)         // Converts to Promise
```

### 4. Transport Types

Current setup uses **TCP**, but NestJS supports:
- TCP (current)
- Redis
- RabbitMQ
- Kafka
- NATS
- gRPC
- MQTT

## Visual Diagram

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ HTTP GET /user/1
       ↓
┌─────────────────────────────────┐
│      API Gateway (Port 3000)    │
│  ┌───────────────────────────┐  │
│  │ HTTP Controller           │  │
│  │ @Get('/user/:id')         │  │
│  └───────┬───────────────────┘  │
│          │                       │
│  ┌───────┴───────────┐          │
│  │ TCP Client        │          │
│  │ userClient.send() │          │
│  └───────┬───────────┘          │
└──────────┼──────────────────────┘
           │ TCP Message
           │ Pattern: { cmd: 'get_user' }
           │ Payload: { id: 1 }
           ↓
┌─────────────────────────────────┐
│  User Service (Port 3001)       │
│  ┌───────────────────────────┐  │
│  │ MessagePattern Handler    │  │
│  │ { cmd: 'get_user' }       │  │
│  │ Returns: user data        │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
           │ TCP Response
           │ { id: 1, name: 'Pooja', ... }
           ↑
┌──────────┼──────────────────────┐
│      API Gateway                │
│  Receives response via TCP      │
│  Returns to client via HTTP     │
└─────────────────────────────────┘
```

## Benefits of This Architecture

1. **Decoupling**: Services don't know about each other directly
2. **Scalability**: Each service can scale independently
3. **Technology Flexibility**: Services can use different transports
4. **Pattern-Based**: Flexible routing based on message patterns
5. **Type Safety**: TypeScript ensures type correctness

## Testing Communication

To verify communication is working:

```bash
# 1. Check all services are running
lsof -i :3000 -i :3001 -i :3002

# 2. Test via API Gateway
curl http://localhost:3000/user/1

# 3. Check logs in each service terminal
# - API Gateway should show HTTP request
# - User Service should show pattern match
```

