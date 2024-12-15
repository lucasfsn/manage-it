export interface UserCredentials {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly username: string;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterCredentials {
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
}

export interface AuthResponse {
  readonly token: string;
  readonly user: UserCredentials;
}
