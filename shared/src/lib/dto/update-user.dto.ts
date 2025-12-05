import { IsEmail, IsOptional, IsString, MinLength, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

