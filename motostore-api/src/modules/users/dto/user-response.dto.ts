import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/modules/auth/types/role.type';

export class SafeUserDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() username: string;
  @ApiProperty() phone: string;
  @ApiProperty({ enum: ['USER', 'ADMIN'] }) role: UserRole;
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
