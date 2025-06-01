import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserRequestBodyDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty()
  @Length(8, 100, { message: 'Password must be between 8 and 100 characters' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  userName: string;

  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{9,14}$/, {
    message: 'Phone number must be in international format, e.g. +359881234567',
  })
  phone: string;
}
