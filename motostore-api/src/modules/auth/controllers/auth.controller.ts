import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserRequestBodyDto } from 'src/modules/users/dto/users.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../dto/auth.dto';
import { AuthResponseDto } from 'src/modules/auth/types/authResponse.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @Post('register')
  @ApiBody({ type: CreateUserRequestBodyDto })
  @ApiOperation({ summary: 'Register' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Validation or duplicate email/phone' })
  async register(
    @Body() data: CreateUserRequestBodyDto,
  ): Promise<AuthResponseDto> {
    console.log(data);
    const user = await this.usersService.createUser(data);
    return this.authService.login(user);
  }
}
