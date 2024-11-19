export interface UserCredentials {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthUserResponse {
  user: UserCredentials;
}

export interface AuthResponse extends AuthUserResponse {
  token: string;
}
