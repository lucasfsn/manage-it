export interface UserCredentials {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly username: string;
}

export interface UpdateUserCredentials {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
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
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: UserCredentials;
}

export interface RefreshTokenResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
}
