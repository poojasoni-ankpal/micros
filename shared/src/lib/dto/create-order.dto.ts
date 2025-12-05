import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'Product name', example: 'Laptop' })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({ description: 'Order amount', example: 999.99, minimum: 0 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'User ID who placed the order', example: '674f1234567890abcdef1234' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Order description', example: 'MacBook Pro 16-inch', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

