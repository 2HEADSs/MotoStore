import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from 'src/common/interfaces/user.interface';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-profile')
  async getMyProfile(@Req() req): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(req.user.email);
    if (!user) return null;
    return user;
  }
}
