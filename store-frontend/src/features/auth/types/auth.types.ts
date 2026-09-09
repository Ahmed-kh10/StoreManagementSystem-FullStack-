export interface RegisterPayload {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  displayName: string;
  email: string;
  token: string;
  refreshToken: string;
}

export interface CurrentUserDto {
  userId: string;
  email: string;
}
