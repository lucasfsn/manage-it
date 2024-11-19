import { Project } from './project.model';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  projects: Project[];
  createdAt: string;
}

export interface UpdateUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
}
