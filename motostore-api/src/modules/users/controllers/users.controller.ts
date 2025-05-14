import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserRequestBodyDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { User } from 'src/common/interfaces/user.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.usersService.getAllUsers();
    }


    @Post()
    async createUser(@Body() data: CreateUserRequestBodyDto): Promise<User> {
        return this.usersService.createUser(data);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile(@Request() req): Promise<User | null> {
        const user = await this.usersService.findUserByEmail(req.user.email);
        if (!user) return null;
        const { hashedPassword, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

}

