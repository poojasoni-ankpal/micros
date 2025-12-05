import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderServiceController } from './order-service.controller';
import { OrderServiceService } from './order-service.service';
import { Order, OrderSchema } from '@nestjs-microservices/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 
            //  'mongodb+srv://db_user:FQWmM8m12eCn99hv@cluster1.jatlwmb.mongodb.net/microservices-learning?retryWrites=true&w=majority',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrderServiceController],
  providers: [OrderServiceService],
})
export class OrderServiceModule {}
