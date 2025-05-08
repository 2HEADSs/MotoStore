import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/module/database/database.service';
import { UserRequestBodyDto } from '../dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private db: DatabaseService) { }

    async createUser(data: UserRequestBodyDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.db.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
            },
        });
        console.log(user);
        return user;
    }
}
