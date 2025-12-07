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
// OVO JE ZA API RESPONSE (backend vraća ovo)
export interface UserTokenDto {
  user: User;
  token: string;
}

// OVO JE ZA FRONTEND STATE (spljošteni objekat)
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