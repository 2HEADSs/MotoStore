import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CreateUserRequestBodyDto } from 'src/modules/users/dto/users.dto';
import { UsersService } from 'src/modules/users/services/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // console.log(req.user,'auth.controller');
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() data: CreateUserRequestBodyDto) {
    const user = await this.usersService.createUser(data);
    // console.log(user);
    return this.authService.login(user);
  }
}
