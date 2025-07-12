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
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


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
  getAll(@Query() filter: UserFilterDto) {
    return this.adminUsersService.findAll(filter);
  }

  @Get('user-profile')
  async getUserProfile(@Query('email') email: string): Promise<User | null> {
    // console.log('Searching for email:', email);
    const user = await this.usersService.getUserByEmail(email);
    if (!user) return null;
    return user;
  }
  @Patch(':id/status')
  blockUser(
    @Param('id') id: string,
    @Body() changeUserStatusDto: ChangeUserStatusDto,
  ): Promise<User | null> {
    return this.adminUsersService.changeUserStatus(
      id,
      changeUserStatusDto.isBlocked,
    );
  }
}
//  @Body() createBikeRequestBodyDto: CreateBikeRequestBodyDto,
