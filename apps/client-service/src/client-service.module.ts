import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientServiceController } from './client-service.controller';
import { ClientServiceService } from './client-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ClientServiceController],
  providers: [ClientServiceService],
})
export class ClientServiceModule {}

