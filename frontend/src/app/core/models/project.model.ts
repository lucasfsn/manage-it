export enum Status {
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface ProjectMember {
  firstName: string;
  lastName: string;
  userName: string;
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
  owner: ProjectMember;
  members: ProjectMember[];
}

export interface ProjectCreate {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}
