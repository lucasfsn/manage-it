import { Project } from './project.model';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  projects: Project[];
  createdAt: string;
}
