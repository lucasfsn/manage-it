import { User } from './user.model';

export interface UserCredentials extends User {
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}
