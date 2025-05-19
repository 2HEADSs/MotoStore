import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserRequestBodyDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { User } from 'src/common/interfaces/user.interface';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

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

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req): Promise<User | null> {
        const user = await this.usersService.findUserByEmail(req.user.email);
        if (!user) return null;
        return user;
    }

}

