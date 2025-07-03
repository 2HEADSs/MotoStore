import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AdminUsersService } from '../services/admin-users.service';
import { UserFilterDto } from '../dto/users.dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get('all')
  getAll(@Query() filter: UserFilterDto) {
    return this.adminUsersService.findAll(filter);
  }
}
