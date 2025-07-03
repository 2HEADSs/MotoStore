import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AdminUsersService } from '../services/admin-users.service';
import { UserFilterDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { User } from '@prisma/client';

@Controller('admin/users')
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

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('user-profile')
  async getUserProfile(@Query('email') email: string): Promise<User | null> {
    // console.log('Searching for email:', email);
    const user = await this.usersService.getUserByEmail(email);
    if (!user) return null;
    return user;
  }
}
