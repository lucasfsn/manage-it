import { UserProject } from './project.model';

export interface User {
  readonly firstName: string;
  readonly lastName: string;
  readonly username: string;
  readonly projects: UserProject[];
  readonly createdAt: string;
  readonly email?: string;
}

export interface UpdateUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface SearchUserRequest {
  pattern: string;
  projectId?: string;
}
