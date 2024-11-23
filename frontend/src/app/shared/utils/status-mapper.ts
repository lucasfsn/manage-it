import { ProjectStatus, TaskStatus } from '../../core/models/project.model';

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
      return 'Completed';
    case TaskStatus.NotStarted:
      return 'Not Started';
    default:
      return 'In Progress';
  }
}
