import { User } from '@/app/features/dto/project.model';

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Task {
  readonly id: string;
  readonly projectId: string;
  readonly members: User[];
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: Priority;
  readonly dueDate: string;
}

export interface TaskData {
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: Priority;
  readonly dueDate: string;
}
