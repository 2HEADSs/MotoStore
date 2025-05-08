import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserRequestBodyDto, UserResponseBodyDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getAllUsers(): Promise<UserResponseBodyDto[]> {
        return this.usersService.getAllUsers();
    }


    @Post()
    async createUser(@Body() data: CreateUserRequestBodyDto): Promise<UserResponseBodyDto> {
        return this.usersService.createUser(data);
    }

}

