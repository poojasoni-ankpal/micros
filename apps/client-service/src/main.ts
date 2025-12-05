import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ClientServiceModule } from './client-service.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ClientServiceModule);
  const configService = app.get(ConfigService);
  
  // Enable CORS for development
  app.enableCors();
  
  // Serve static files from public directory
  const publicPath = join(__dirname, '../../../apps/client-service/public');
  app.useStaticAssets(publicPath);
  
  // Get API Gateway URL for frontend
  const apiGatewayUrl = configService.get<string>('API_GATEWAY_URL') || 'http://localhost:3000';
  const port = configService.get<number>('CLIENT_SERVICE_PORT') || 4000;
  
  await app.listen(port);
  
  console.log(`🌐 UI Service running on port ${port}`);
  console.log(`👉 Open http://localhost:${port} in your browser`);
  console.log(`📁 Serving static files from: ${publicPath}`);
  console.log(`🔗 API Gateway URL: ${apiGatewayUrl}`);
}
bootstrap();

