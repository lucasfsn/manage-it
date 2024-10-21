export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
}

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
