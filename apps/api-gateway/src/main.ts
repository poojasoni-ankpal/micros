import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enable CORS
  app.enableCors();
  
  // Global prefix
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  
  const port = configService.get<number>('API_GATEWAY_PORT') || 3000;
  await app.listen(port);
  
  Logger.log(
    `🚀 API Gateway running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(`📝 User endpoints: http://localhost:${port}/${globalPrefix}/users`);
  Logger.log(`📦 Order endpoints: http://localhost:${port}/${globalPrefix}/orders`);
}

bootstrap();
