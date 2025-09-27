import { UserRole } from './role.type';

export type PublicUserPayload = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
};
