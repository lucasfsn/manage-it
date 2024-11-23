import { User } from './project.model';

export interface Notification {
  readonly id: string;
  readonly user: User;
  readonly message: string;
  readonly date: string;
  readonly projectId: string;
  readonly taskId?: string;
}
