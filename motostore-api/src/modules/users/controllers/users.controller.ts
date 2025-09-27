import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { BikesStatusFilterDto } from 'src/modules/bikes/dto/bikesStatusFilter.dto';
import { BikeResponseDto } from 'src/modules/bikes/dto/BikeResponseDto.dto';
import { SafeUser } from '../types/safe-user.type';
import { ExtendedUserDto } from '../dto/users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my-profile')
  @ApiOperation({ summary: 'Get my profile' })
  @ApiOkResponse({ type: ExtendedUserDto })
  async getMyProfile(@Req() req): Promise<SafeUser> {
    return this.usersService.getUserByEmail(req.user.email);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my-liked-bikes')
  @ApiOperation({ summary: 'All my liked bikes' })
  @ApiOkResponse({ type: BikeResponseDto, isArray: true })
  allLikedBikes(@CurrentUser() user: { id: string }) {
    return this.usersService.getLikedBikes(user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my-bikes')
  @ApiOperation({ summary: 'List my bikes, optionally filtered by status' })
  @ApiOkResponse({ type: BikeResponseDto, isArray: true })
  findMyBikes(
    @CurrentUser() user: { id: string; email: string; role: string },
    @Query() filter: BikesStatusFilterDto,
  ) {
    return this.usersService.getCreatedBikes(user.id, filter.status);
  }
}
