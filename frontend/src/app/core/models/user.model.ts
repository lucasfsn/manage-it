import { Project } from './project.model';

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  projects: Project[];
  createdAt: string;
  email?: string;
}

export interface UpdateUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}
