import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(UserServiceModule);
  const configService = appContext.get(ConfigService);
  
  const microservice = await NestFactory.createMicroservice(UserServiceModule, {
    transport: Transport.TCP,
    options: {
      port: configService.get<number>('USER_SERVICE_PORT') || 3001,
    },
  });

  await microservice.listen();
  
  const port = configService.get<number>('USER_SERVICE_PORT') || 3001;
  console.log(`User Microservice running on port ${port}`);
}
bootstrap();
