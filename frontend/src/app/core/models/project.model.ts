export interface User {
  readonly firstName: string;
  readonly lastName: string;
  readonly username: string;
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum TaskStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
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
  projectId: string;
  priority: Priority;
  dueDate: string;
  users: User[];
}

export interface TaskUpdate {
  id: string;
  projectId: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
}

export enum Status {
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly completedTasks: number;
  readonly totalTasks: number;
  readonly status: Status;
  readonly owner: User;
  readonly members: User[];
  readonly tasks: Task[];
}

export interface ProjectCreate {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface ProjectUpdate {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}
