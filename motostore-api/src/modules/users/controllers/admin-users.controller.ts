import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AdminUsersService } from '../services/admin-users.service';
import { ChangeUserStatusDto, UserFilterDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { Bike, User } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SafeUser } from '../types/safe-user.type';
import { ExtendedUserDto } from '../dto/user-response.dto';

@ApiTags('AdminUsers')
@Controller('admin/users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminUsersController {
  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly usersService: UsersService,
  ) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: ExtendedUserDto, isArray: true })
  getAll(@Query() filter: UserFilterDto): Promise<ExtendedUserDto[]> {
    return this.adminUsersService.findAll(filter);
  }

  @Get('user-profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({ type: ExtendedUserDto })
  @ApiNotFoundResponse({ description: 'User with given email not found' })
  async getUserProfile(
    @Query('email') email: string,
  ): Promise<ExtendedUserDto> {
    return await this.usersService.getUserByEmail(email);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Block/Unblock user' })
  blockUser(
    @Param('id') id: string,
    @Body() changeUserStatusDto: ChangeUserStatusDto,
  ): Promise<SafeUser> {
    return this.adminUsersService.changeUserStatus(
      id,
      changeUserStatusDto.isBlocked,
    );
  }

  @Get(':id/likes')
  @ApiOperation({ summary: 'Get user liked bikes' })
  userLikedBikes(@Param('id') userId: string): Promise<Bike[]> {
    return this.adminUsersService.userLikedBikes(userId);
  }
}
