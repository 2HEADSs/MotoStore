import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from 'src/common/interfaces/user.interface';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my-profile')
  async getMyProfile(@Req() req): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(req.user.email);
    if (!user) return null;
    return user;
  }
}
