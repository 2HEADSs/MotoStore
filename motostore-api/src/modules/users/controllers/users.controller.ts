import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  //   @Post()
  //   async createUser(@Body() data: CreateUserRequestBodyDto): Promise<User> {
  //       return this.usersService.createUser(data);
  //   }

  @UseGuards(JwtAuthGuard)
  @Get('my-profile')
  async getMyProfile(@Req() req): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(req.user.email);
    if (!user) return null;
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-profile')
  async getUserProfile(@Query('email') email: string): Promise<User | null> {
    console.log('Searching for email:', email);
    const user = await this.usersService.findUserByEmail(email);
    if (!user) return null;
    return user;
  }
}
