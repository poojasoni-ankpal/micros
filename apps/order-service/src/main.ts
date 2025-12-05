import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(OrderServiceModule);
  const configService = appContext.get(ConfigService);
  
  const microservice = await NestFactory.createMicroservice(OrderServiceModule, {
    transport: Transport.TCP,
    options: {
      port: configService.get<number>('ORDER_SERVICE_PORT') || 3002,
    },
  });

  await microservice.listen();
  
  const port = configService.get<number>('ORDER_SERVICE_PORT') || 3002;
  console.log(`Order Microservice running on port ${port}`);
}
bootstrap();
