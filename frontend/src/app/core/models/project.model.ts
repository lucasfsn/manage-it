export enum TaskStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface User {
  firstName: string;
  lastName: string;
  userName: string;
}

export interface Task {
  id: string;
  projectId: string;
  users: User[];
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
}

export interface TaskCreate {
  description: string;
  status: TaskStatus;
  projectId: string;
  priority: Priority;
  dueDate: string;
  users: User[];
}

export enum Status {
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  completedTasks: number;
  totalTasks: number;
  status: Status;
  owner: User;
  members: User[];
  tasks: Task[];
}

export interface ProjectCreate {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface UpdateProject {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface UpdateTask {
  id: string;
  projectId: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
}
