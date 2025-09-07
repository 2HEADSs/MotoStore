import { IsEnum, IsOptional } from 'class-validator';
import { ListingStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BikesStatusFilterDto {
  @ApiPropertyOptional({
    enum: ListingStatus,
    description: 'Optional status filter',
  })
  @IsOptional()
  @IsEnum(ListingStatus, { message: 'Invalid listing status' })
  status?: ListingStatus;
}
