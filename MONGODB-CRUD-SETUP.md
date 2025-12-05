# MongoDB CRUD Operations Setup Guide

## Overview

This microservices architecture now includes full CRUD operations for Users and Orders using MongoDB Atlas.

## What's Been Implemented

### 1. **MongoDB Atlas Integration** ✅
- Connection string configured
- Mongoose ODM integrated
- Schemas for User and Order entities

### 2. **Shared DTOs and Schemas** ✅
Location: `shared/src/lib/`

**DTOs:**
- `CreateUserDto` - Validation for creating users
- `UpdateUserDto` - Validation for updating users
- `CreateOrderDto` - Validation for creating orders
- `UpdateOrderDto` - Validation for updating orders

**Schemas:**
- `User` - username, email, password, fullName, isActive
- `Order` - product, amount, userId (ref), status, description

### 3. **User Service (Port 3001)** ✅
**CRUD Operations:**
- `create_user` - Create new user
- `get_user` - Get user by ID
- `get_all_users` - List all users
- `update_user` - Update user
- `delete_user` - Delete user

### 4. **Order Service (Port 3002)** ✅
**CRUD Operations:**
- `create_order` - Create new order
- `get_order` - Get order by ID
- `get_all_orders` - List all orders (optionally filter by userId)
- `update_order` - Update order
- `delete_order` - Delete order

### 5. **API Gateway (Port 3000)** ✅
**REST Endpoints:**

**Users:**
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Orders:**
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (query param: ?userId=xxx)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

## Installation

### 1. Install Dependencies

```bash
cd /home/pooja/nest-micros/microservices-learning
npm install
```

**New packages added:**
- `@nestjs/mongoose` - MongoDB integration
- `@nestjs/config` - Environment variables
- `mongoose` - MongoDB ODM
- `class-validator` - DTO validation
- `class-transformer` - DTO transformation

### 2. Environment Variables

The `.env` file has been created with:
```env
MONGODB_URI=xxx
API_GATEWAY_PORT=3000
USER_SERVICE_PORT=3001
ORDER_SERVICE_PORT=3002
CLIENT_SERVICE_PORT=4000
API_GATEWAY_URL=http://localhost:3000
```

## Running the Services

### Start All Services

```bash
npm run start:all
```

Or individually:

```bash
# Terminal 1 - API Gateway
nest start api-gateway --watch

# Terminal 2 - User Service
nest start user-service --watch

# Terminal 3 - Order Service
nest start order-service --watch

# Terminal 4 - UI Service
nest start client-service --watch
```

## Testing the API

### Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

**Response:**
```json
{
  "_id": "674f1234567890abcdef1234",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "isActive": true,
  "createdAt": "2024-12-04T12:00:00.000Z",
  "updatedAt": "2024-12-04T12:00:00.000Z"
}
```

### Get All Users

```bash
curl http://localhost:3000/api/users
```

### Get User by ID

```bash
curl http://localhost:3000/api/users/674f1234567890abcdef1234
```

### Update User

```bash
curl -X PUT http://localhost:3000/api/users/674f1234567890abcdef1234 \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Updated Doe"
  }'
```

### Delete User

```bash
curl -X DELETE http://localhost:3000/api/users/674f1234567890abcdef1234
```

### Create an Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "product": "Laptop",
    "amount": 999.99,
    "userId": "674f1234567890abcdef1234",
    "description": "MacBook Pro 16-inch"
  }'
```

### Get All Orders

```bash
# All orders
curl http://localhost:3000/api/orders

# Orders for specific user
curl http://localhost:3000/api/orders?userId=674f1234567890abcdef1234
```

### Update Order

```bash
curl -X PUT http://localhost:3000/api/orders/674f5678901234abcdef5678 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Delete Order

```bash
curl -X DELETE http://localhost:3000/api/orders/674f5678901234abcdef5678
```

## Architecture Flow

```
Client/UI (Port 4000)
    ↓ HTTP
API Gateway (Port 3000)
    ↓ TCP Message Patterns
    ├─→ User Service (Port 3001) → MongoDB Atlas
    └─→ Order Service (Port 3002) → MongoDB Atlas
```

## Features Implemented

### ✅ Best Practices

1. **DTOs with Validation** - Using class-validator decorators
2. **Environment Variables** - Using @nestjs/config
3. **Structured Logging** - Using NestJS Logger
4. **Error Handling** - NotFoundException for missing resources
5. **CORS Enabled** - For frontend integration
6. **Global Validation Pipe** - Automatic DTO validation
7. **Password Exclusion** - Passwords not returned in responses
8. **Population** - Orders populate user data
9. **Timestamps** - Automatic createdAt/updatedAt

### 🔒 Security Notes

**Important:** The current implementation stores passwords in plain text. For production:

1. **Hash passwords** using bcrypt:
```typescript
import * as bcrypt from 'bcrypt';

async create(createUserDto: CreateUserDto) {
  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  const user = new this.userModel({
    ...createUserDto,
    password: hashedPassword,
  });
  return user.save();
}
```

2. **Add authentication** (JWT tokens)
3. **Add authorization** (role-based access control)
4. **Validate MongoDB ObjectIds**
5. **Add rate limiting**

## Database Schema

### User Collection

```typescript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (required),
  fullName: String (optional),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection

```typescript
{
  _id: ObjectId,
  product: String (required),
  amount: Number (required),
  userId: ObjectId (ref: 'User', required),
  status: String (enum: ['pending', 'processing', 'completed', 'cancelled']),
  description: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Next Steps

1. **Update UI** - Add forms for CRUD operations
2. **Add Authentication** - JWT-based auth
3. **Add Pagination** - For list endpoints
4. **Add Search/Filter** - Query capabilities
5. **Add Swagger** - API documentation
6. **Add Tests** - Unit and E2E tests
7. **Hash Passwords** - Security improvement
8. **Add Validation** - MongoDB ObjectId validation

## Troubleshooting

### MongoDB Connection Issues

1. Check if MongoDB URI is correct in `.env`
2. Verify IP whitelist in MongoDB Atlas (allow 0.0.0.0/0 for testing)
3. Check database user permissions

### Validation Errors

DTOs will automatically validate:
- Required fields
- Email format
- String lengths
- Number ranges

### Service Communication

If services can't communicate:
1. Ensure all services are running
2. Check ports match (3001, 3002)
3. Verify TCP connections

## Summary

You now have a fully functional microservices architecture with:
- ✅ MongoDB Atlas integration
- ✅ Complete CRUD operations
- ✅ DTO validation
- ✅ Proper error handling
- ✅ Environment configuration
- ✅ Structured logging
- ✅ RESTful API Gateway

All services are ready to use!

