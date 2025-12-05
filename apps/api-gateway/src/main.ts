import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_GATEWAY_PORT') || 3000;
  
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
  
  // Swagger Configuration (must be after global prefix)
  const config = new DocumentBuilder()
    .setTitle('Microservices API Gateway')
    .setDescription('API documentation for User and Order microservices')
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addTag('orders', 'Order management endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });
  
  await app.listen(port);
  
  Logger.log(
    `🚀 API Gateway running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(`📝 User endpoints: http://localhost:${port}/${globalPrefix}/users`);
  Logger.log(`📦 Order endpoints: http://localhost:${port}/${globalPrefix}/orders`);
  Logger.log(`📚 Swagger Docs: http://localhost:${port}/api-docs`);
}

bootstrap();
