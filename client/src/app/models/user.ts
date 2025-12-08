export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  role: Role;
  isApproved: boolean;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}
export interface UserTokenDto {
  user: User;
  token: string;
}

export interface UserWithToken extends User {
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}
export type RegisterFormDto = RegisterDto & {
  confirmPassword: string;
};

export interface PendingAdmin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
