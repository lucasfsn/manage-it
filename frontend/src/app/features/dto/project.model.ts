import { Task } from './task.model';

export enum ProjectStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface User {
  readonly firstName: string;
  readonly lastName: string;
  readonly username: string;
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly completedTasks: number;
  readonly totalTasks: number;
  readonly status: ProjectStatus;
  readonly owner: User;
  readonly members: User[];
  readonly tasks: Task[];
}

export interface UserProject {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: ProjectStatus;
  readonly members: User[];
}

export interface ProjectRequest {
  readonly name: string;
  readonly description: string;
  readonly startDate: string;
  readonly endDate: string;
}
