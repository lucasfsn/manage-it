import { User } from './project.model';

export interface Notification {
  id: string;
  user: User;
  message: string;
  date: string;
  projectId?: string;
  taskId?: string;
}
