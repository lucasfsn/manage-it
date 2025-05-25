export interface UserDto {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly username: string;
}

export interface AuthDto {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: UserDto;
}

export interface RefreshTokenDto {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface AuthPayload {
  readonly email: string;
  readonly password: string;
}

export interface SignupPayload {
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
}
