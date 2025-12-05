import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderServiceService } from './order-service.service';
import { CreateOrderDto, UpdateOrderDto } from '@nestjs-microservices/shared';

@Controller()
export class OrderServiceController {
  constructor(private readonly orderServiceService: OrderServiceService) {}

  @MessagePattern({ cmd: 'create_order' })
  createOrder(data: CreateOrderDto) {
    return this.orderServiceService.create(data);
  }

  @MessagePattern({ cmd: 'get_order' })
  getOrder(data: { id: string }) {
    return this.orderServiceService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'get_all_orders' })
  getAllOrders(data?: { userId?: string }) {
    return this.orderServiceService.findAll(data?.userId);
  }

  @MessagePattern({ cmd: 'update_order' })
  updateOrder(data: { id: string; updateData: UpdateOrderDto }) {
    return this.orderServiceService.update(data.id, data.updateData);
  }

  @MessagePattern({ cmd: 'delete_order' })
  deleteOrder(data: { id: string }) {
    return this.orderServiceService.remove(data.id);
  }
}
