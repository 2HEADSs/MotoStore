import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { id: string; email: string; role: string }) {
    const user = await this.usersService.getUserById(payload.id);
    if (!user || user.isBlocked) {
      throw new ForbiddenException('Account is disabled');
    }
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
