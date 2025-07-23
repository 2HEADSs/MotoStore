import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserRequestBodyDto } from 'src/modules/users/dto/users.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login page/form' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @Post('register')
  @ApiBody({ type: CreateUserRequestBodyDto })
  @ApiOperation({ summary: 'Register page/form' })
  async register(@Body() data: CreateUserRequestBodyDto) {
    const user = await this.usersService.createUser(data);
    // console.log(user);
    return this.authService.login(user);
  }
}
