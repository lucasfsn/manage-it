export interface User {
  readonly firstName: string;
  readonly lastName: string;
  readonly username: string;
}

export enum Priority {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
}

export enum TaskStatus {
  NotStarted = 'NOT_STARTED',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
}

export interface Task {
  readonly id: string;
  readonly projectId: string;
  readonly users: User[];
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: Priority;
  readonly dueDate: string;
}

export interface TaskCreate {
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
}

export interface TaskUpdate {
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
}

export enum ProjectStatus {
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
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

export interface ProjectCreate {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface ProjectUpdate {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}
