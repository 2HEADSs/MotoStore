import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/common/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      // console.log('AuthService => validateUser');
      const user = await this.usersService.getUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }
      if (user.isBlocked) {
        throw new UnauthorizedException('Account is blocked');
      }
      const { hashedPassword, ...userWithoutPassword } = user;
      return userWithoutPassword;
      // console.log(user, 'AuthService => validateUser: Full user object');
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      console.error('AuthService => validateUser error:', error);
      throw new InternalServerErrorException('Failed to validate user');
    }
  }

  async login(user: User) {
    // console.log(user, 'AuthService => Login');
    try {
      const userPayload = {
        id: user.id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        role: user.role,
      };
      const token = this.jwtService.sign(userPayload);
      return {
        userPayload,
        access_token: token,
      };
    } catch (error) {
      // console.error('AuthService => login error:', error);
      throw new InternalServerErrorException('Failed to login');
    }
  }
}
