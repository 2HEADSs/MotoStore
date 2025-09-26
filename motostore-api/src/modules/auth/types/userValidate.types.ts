import { UserRole } from './role.type';

export type UserValidateData = {
  id: string;
  email: string;
  role: UserRole;
};
