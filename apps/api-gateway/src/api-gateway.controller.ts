import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  Query,
  ValidationPipe,
  UsePipes,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  CreateUserDto,
  UpdateUserDto,
  CreateOrderDto,
  UpdateOrderDto,
} from '@nestjs-microservices/shared';

@ApiTags('users', 'orders')
@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AppController {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
  ) {}

  // User endpoints
  @ApiTags('users')
  @Post('/users')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return lastValueFrom(
      this.userClient.send({ cmd: 'create_user' }, createUserDto)
    );
  }

  @ApiTags('users')
  @Get('/users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all users' })
  async getAllUsers() {
    return lastValueFrom(this.userClient.send({ cmd: 'get_all_users' }, {}));
  }

  @ApiTags('users')
  @Get('/users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'User found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async getUser(@Param('id') id: string) {
    return lastValueFrom(this.userClient.send({ cmd: 'get_user' }, { id }));
  }

  @ApiTags('users')
  @Put('/users/:id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return lastValueFrom(
      this.userClient.send({ cmd: 'update_user' }, { id, updateData: updateUserDto })
    );
  }

  @ApiTags('users')
  @Delete('/users/:id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async deleteUser(@Param('id') id: string) {
    return lastValueFrom(this.userClient.send({ cmd: 'delete_user' }, { id }));
  }

  // Order endpoints
  @ApiTags('orders')
  @Post('/orders')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Order created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return lastValueFrom(
      this.orderClient.send({ cmd: 'create_order' }, createOrderDto)
    );
  }

  @ApiTags('orders')
  @Get('/orders')
  @ApiOperation({ summary: 'Get all orders' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter orders by user ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all orders' })
  async getAllOrders(@Query('userId') userId?: string) {
    return lastValueFrom(
      this.orderClient.send({ cmd: 'get_all_orders' }, { userId })
    );
  }

  @ApiTags('orders')
  @Get('/orders/:id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Order found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  async getOrder(@Param('id') id: string) {
    return lastValueFrom(
      this.orderClient.send({ cmd: 'get_order' }, { id })
    );
  }

  @ApiTags('orders')
  @Put('/orders/:id')
  @ApiOperation({ summary: 'Update order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID', type: String })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Order updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return lastValueFrom(
      this.orderClient.send({ cmd: 'update_order' }, { id, updateData: updateOrderDto })
    );
  }

  @ApiTags('orders')
  @Delete('/orders/:id')
  @ApiOperation({ summary: 'Delete order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Order deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  async deleteOrder(@Param('id') id: string) {
    return lastValueFrom(
      this.orderClient.send({ cmd: 'delete_order' }, { id })
    );
  }
}
