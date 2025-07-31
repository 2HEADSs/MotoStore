import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';

export interface JwtUser {
  id: string | null;
  email: string | null;
  role: 'USER' | 'ADMIN' | 'GUEST';
}

@Injectable()
export class OptionalJwtGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      await super.canActivate(context);
      console.log(req.user);
      console.log("canactive");
      return true;
    } catch (error) {}
    if (!req.user) {
      console.log("null");

      req.user = { id: null, email: null, role: 'GUEST' };
    }
    return true;
  }
}
