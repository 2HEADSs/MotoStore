

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  phone: string;
  role: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  hashedPassword: string;
};


