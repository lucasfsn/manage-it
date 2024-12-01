import { ProjectStatus, TaskStatus } from '../../features/dto/project.model';

export function projectStatusMapper(status: ProjectStatus): string {
  switch (status) {
    case ProjectStatus.InProgress:
      return 'In Progress';
    case ProjectStatus.Completed:
      return 'Completed';
    default:
      return 'In Progress';
  }
}

export function taskStatusMapper(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.InProgress:
      return 'In Progress';
    case TaskStatus.Completed:
      return 'Done';
    case TaskStatus.NotStarted:
      return 'Upcoming';
    default:
      return 'In Progress';
  }
}
