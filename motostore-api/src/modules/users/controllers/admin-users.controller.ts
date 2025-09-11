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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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
  getAll(@Query() filter: UserFilterDto) {
    return this.adminUsersService.findAll(filter);
  }

  @Get('user-profile')
  @ApiOperation({ summary: 'Get user profile' })
  async getUserProfile(@Query('email') email: string): Promise<User | null> {
    // console.log('Searching for email:', email);
    const user = await this.usersService.getUserByEmail(email);
    if (!user) return null;
    return user;
  }
  @Patch(':id/status')
  @ApiOperation({ summary: 'Block/Unblock user' })
  blockUser(
    @Param('id') id: string,
    @Body() changeUserStatusDto: ChangeUserStatusDto,
  ): Promise<User | null> {
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
