import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { User, UserSchema } from '@nestjs-microservices/shared';

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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
