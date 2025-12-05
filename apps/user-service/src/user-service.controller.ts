import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserServiceService } from './user-service.service';
import { CreateUserDto, UpdateUserDto } from '@nestjs-microservices/shared';

@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @MessagePattern({ cmd: 'create_user' })
  createUser(data: CreateUserDto) {
    return this.userServiceService.create(data);
  }

  @MessagePattern({ cmd: 'get_user' })
  getUser(data: { id: string }) {
    return this.userServiceService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'get_all_users' })
  getAllUsers() {
    return this.userServiceService.findAll();
  }

  @MessagePattern({ cmd: 'update_user' })
  updateUser(data: { id: string; updateData: UpdateUserDto }) {
    return this.userServiceService.update(data.id, data.updateData);
  }

  @MessagePattern({ cmd: 'delete_user' })
  deleteUser(data: { id: string }) {
    return this.userServiceService.remove(data.id);
  }
}
