export interface UserCredentials {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}
