import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  product?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @IsString()
  @IsOptional()
  @IsEnum(['pending', 'processing', 'completed', 'cancelled'])
  status?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

