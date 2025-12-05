import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ default: 'pending', enum: ['pending', 'processing', 'completed', 'cancelled'] })
  status: string;

  @Prop()
  description?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

