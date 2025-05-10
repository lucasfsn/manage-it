import { UserProject } from '@/app/features/dto/project.model';

export interface User {
  readonly firstName: string;
  readonly lastName: string;
  readonly username: string;
  readonly projects: UserProject[];
  readonly createdAt: string;
  readonly email?: string;
}

export interface UpdateUser {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password?: string;
}

export interface SearchUserRequest {
  readonly pattern: string;
  readonly projectId?: string;
}
