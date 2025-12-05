import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, CreateOrderDto, UpdateOrderDto } from '@nestjs-microservices/shared';

@Injectable()
export class OrderServiceService {
  private readonly logger = new Logger(OrderServiceService.name);

  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    this.logger.log(`Creating order for product: ${createOrderDto.product}`);
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(userId?: string): Promise<Order[]> {
    const query = userId ? { userId } : {};
    this.logger.log(`Fetching orders${userId ? ` for user: ${userId}` : ''}`);
    return this.orderModel.find(query).populate('userId', 'username email').exec();
  }

  async findOne(id: string): Promise<Order> {
    this.logger.log(`Fetching order with ID: ${id}`);
    const order = await this.orderModel
      .findById(id)
      .populate('userId', 'username email')
      .exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    this.logger.log(`Updating order with ID: ${id}`);
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .populate('userId', 'username email')
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updatedOrder;
  }

  async remove(id: string): Promise<{ deleted: boolean; message: string }> {
    this.logger.log(`Deleting order with ID: ${id}`);
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return {
      deleted: true,
      message: `Order with ID ${id} has been deleted`,
    };
  }
}
