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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  CreateUserDto,
  UpdateUserDto,
  CreateOrderDto,
  UpdateOrderDto,
} from '@nestjs-microservices/shared';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AppController {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
  ) {}

  // User endpoints
  @Post('/users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return lastValueFrom(
      this.userClient.send({ cmd: 'create_user' }, createUserDto)
    );
  }

  @Get('/users')
  async getAllUsers() {
    return lastValueFrom(this.userClient.send({ cmd: 'get_all_users' }, {}));
  }

  @Get('/users/:id')
  async getUser(@Param('id') id: string) {
    return lastValueFrom(this.userClient.send({ cmd: 'get_user' }, { id }));
  }

  @Put('/users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return lastValueFrom(
      this.userClient.send({ cmd: 'update_user' }, { id, updateData: updateUserDto })
    );
  }

  @Delete('/users/:id')
  async deleteUser(@Param('id') id: string) {
    return lastValueFrom(this.userClient.send({ cmd: 'delete_user' }, { id }));
  }

  // Order endpoints
  @Post('/orders')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return lastValueFrom(
      this.orderClient.send({ cmd: 'create_order' }, createOrderDto)
    );
  }

  @Get('/orders')
  async getAllOrders(@Query('userId') userId?: string) {
    return lastValueFrom(
      this.orderClient.send({ cmd: 'get_all_orders' }, { userId })
    );
  }

  @Get('/orders/:id')
  async getOrder(@Param('id') id: string) {
    return lastValueFrom(
      this.orderClient.send({ cmd: 'get_order' }, { id })
    );
  }

  @Put('/orders/:id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return lastValueFrom(
      this.orderClient.send({ cmd: 'update_order' }, { id, updateData: updateOrderDto })
    );
  }

  @Delete('/orders/:id')
  async deleteOrder(@Param('id') id: string) {
    return lastValueFrom(
      this.orderClient.send({ cmd: 'delete_order' }, { id })
    );
  }
}
