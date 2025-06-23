import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestBodyDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address. Must be a valid email format.',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    example: 'P@ssword123',
    minLength: 8,
    maxLength: 100,
    description: 'Password with a length between 8 and 100 characters.',
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 100, { message: 'Password must be between 8 and 100 characters' })
  password: string;

  @ApiProperty({
    example: 'moto_rider23',
    minLength: 3,
    maxLength: 20,
    description: 'username with 3 to 20 characters.',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'username must be between 3 and 20 characters' })
  username: string;

  @ApiProperty({
    example: '+359881234567',
    description: 'Phone number in international format, e.g. +359...',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?[1-9]\d{9,14}$/, {
    message: 'Phone number must be in international format, e.g. +359881234567',
  })
  phone: string;
}
