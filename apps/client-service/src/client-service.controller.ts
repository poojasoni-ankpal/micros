import { Controller, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { ClientServiceService } from './client-service.service';
import { join } from 'path';

@Controller()
export class ClientServiceController {
  constructor(
    private readonly clientServiceService: ClientServiceService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHome(@Res() res: Response) {
    // __dirname is /home/pooja/nest-micros/microservices-learning/dist/apps/client-service
    // We need to go to /home/pooja/nest-micros/microservices-learning/apps/client-service/public/index.html
    const htmlPath = join(__dirname, '../../../apps/client-service/public/index.html');
    res.sendFile(htmlPath);
  }

  @Get('/api/user/:id')
  async getUser(@Param('id') id: string) {
    return this.clientServiceService.getUser(Number(id));
  }

  @Get('/api/order/:id')
  async getOrder(@Param('id') id: string) {
    return this.clientServiceService.getOrder(Number(id));
  }

  @Get('/api/health')
  healthCheck() {
    return { 
      status: 'ok', 
      service: 'ui-service',
      apiGatewayUrl: this.configService.get<string>('API_GATEWAY_URL') || 'http://localhost:3000',
    };
  }

  @Get('/api/config')
  getConfig() {
    return {
      apiGatewayUrl: this.configService.get<string>('API_GATEWAY_URL') || 'http://localhost:3000',
    };
  }
}

