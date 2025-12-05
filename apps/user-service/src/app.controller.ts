import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  
  @MessagePattern({ cmd: 'get_user' })
  getUser(data: { id: number }) {
    return { id: data.id, name: 'Pooja', email: 'pooja@test.com' };
  }
}
