export enum Status {
  InProgress = 'In Progress',
  Completed = 'Completed',
}

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

export interface Team {
  id: string;
  name: string;
  description: string;
  members: User[];
}

export interface Task {
  id: string;
  projectId: string;
  users: User[];
  name: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
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
  teams: Team[];
}

export interface ProjectCreate {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface TaskCreate {
  projectId: string;
  users: User[];
  name: string;
  priority: Priority;
  dueDate: string;
}
