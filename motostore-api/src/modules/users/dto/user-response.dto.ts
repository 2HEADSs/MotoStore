import { ApiProperty } from '@nestjs/swagger';

export class SafeUserDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() username: string;
  @ApiProperty() phone: string;
  @ApiProperty({ enum: ['USER', 'ADMIN'] }) role: 'USER' | 'ADMIN';
}

export class AuthResponseDto {
  @ApiProperty({ type: SafeUserDto }) user: SafeUserDto;
  @ApiProperty() accessToken: string;
}

export class ExtendedUserDto extends SafeUserDto {
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiProperty() isBlocked: boolean;
}
