import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users.service';
import * as bcrypt from 'bcrypt';


interface User {
    id: string;
    email: string;
    userName: string;
    phone: string;
    hashedPassword: string;
    createdAt: Date;
    updatedAt: Date;
}
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }


    async validateUser(email: string, password: string): Promise<Omit<User, 'hashedPassword'> | null> {

        // console.log('AuthService => validateUser');
        const user = await this.usersService.findUserByEmail(email);
        // console.log(user, 'AuthService => validateUser: Full user object');
        if (user && await bcrypt.compare(password, user.hashedPassword)) {
            const { hashedPassword, ...result } = user;
            // console.log(result, 'AuthService => validateUser: Result object (returned)');
            return result;
        }
        return null;
    }

    async login(user: {
        id: string;
        email: string;
        userName: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
    }) {
        // console.log(user, 'AuthService => Login');
        const userPayload = {
            id: user.id,
            email: user.email,
            userName: user.userName,
        };
        // console.log(user, 'AuthService => Login');

        return {
            access_token: this.jwtService.sign(userPayload),
        };
    }
}
