import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({ description: 'Product name', example: 'Laptop', required: false })
  @IsString()
  @IsOptional()
  product?: string;

  @ApiProperty({ description: 'Order amount', example: 999.99, minimum: 0, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @ApiProperty({ 
    description: 'Order status', 
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    example: 'completed',
    required: false 
  })
  @IsString()
  @IsOptional()
  @IsEnum(['pending', 'processing', 'completed', 'cancelled'])
  status?: string;

  @ApiProperty({ description: 'Order description', example: 'MacBook Pro 16-inch', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

