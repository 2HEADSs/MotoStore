import { Body, Controller, Post } from '@nestjs/common';
import { UserRequestBodyDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async createUser(@Body() data: UserRequestBodyDto) {
        return this.usersService.createUser(data);
    }
}

