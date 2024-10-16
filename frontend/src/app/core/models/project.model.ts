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
}
