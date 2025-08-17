import { IsEnum, IsOptional, IsIn } from 'class-validator';
import { ListingStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

// const ALLOWED_STATUSES = [ListingStatus.ACTIVE, ListingStatus.SOLD] as const;
// type AllowedStatus = (typeof ALLOWED_STATUSES)[number];
// export class BikeStatusFilterDto {
//   @ApiPropertyOptional({
//     enum: ALLOWED_STATUSES,
//     description: 'Optional status filter return active by default',
//     default: ListingStatus.ACTIVE,
//   })
//   @IsOptional()
//   @IsIn(ALLOWED_STATUSES, { message: 'Invalid listing status' })
//   status: AllowedStatus;
// }

export class MyBikesStatusFilterDto {
  @ApiPropertyOptional({
    enum: ListingStatus,
    description: 'Optional status filter',
  })
  @IsOptional()
  @IsEnum(ListingStatus, { message: 'Invalid listing status' })
  status?: ListingStatus;
}
