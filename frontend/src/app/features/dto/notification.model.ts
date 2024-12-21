import { User } from '../../features/dto/project.model';

export interface Notification {
  readonly id: string;
  readonly user: User;
  readonly message: string;
  readonly date: string;
  readonly projectId: string;
  readonly taskId?: string;
}

export enum NotificationType {
  PROJECT = 'project',
  TASK = 'task',
}

export enum NotificationOperation {
  COMPLETE = 'complete',
  UPDATE = 'update',
  JOIN = 'join',
  LEAVE = 'leave',
  CREATE = 'create',
  DELETE = 'delete',
}
