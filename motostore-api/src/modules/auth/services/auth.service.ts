import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/common/interfaces/user.interface';
import { UserRole } from '../types/role.type';
import { LoginResponse } from '../types/loginResponse.type';
import { PublicUserPayload } from '../types/publisUserPayload.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      // console.log('AuthService => validateUser');
      const user = await this.usersService.getUserForAuth(email);
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
      if (!passwordMatch) {
        console.log('passwordMatch');
        throw new UnauthorizedException('Invalid email or password');
      }
      if (user.isBlocked) {
        throw new UnauthorizedException('Account is disabled');
      }
      const { hashedPassword, ...userWithoutPassword } = user;
      return userWithoutPassword;
      // console.log(user, 'AuthService => validateUser: Full user object');
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      if (error instanceof NotFoundException)
        throw new UnauthorizedException('Invalid email or password');
      // console.error('AuthService => validateUser error:', error);
      throw new InternalServerErrorException(
        'Failed to validate user. Please try again.',
      );
      // return error.message;
    }
  }

  async login(user: User): Promise<LoginResponse> {
    try {
      const userPayload: PublicUserPayload = {
        id: user.id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        role: user.role as UserRole,
      };
      const accessToken = this.jwtService.sign(userPayload);

      return {
        user: userPayload,
        accessToken,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      // console.error('AuthService => login error:', error);
      throw new InternalServerErrorException('Failed to login');
    }
  }
}
