import { ProjectStatus, TaskStatus } from '../../features/dto/project.model';

export function projectStatusMapper(status: ProjectStatus): string {
  switch (status) {
    case ProjectStatus.IN_PROGRESS:
      return 'In Progress';
    case ProjectStatus.COMPLETED:
      return 'Completed';
  }
}

export function taskStatusMapper(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.IN_PROGRESS:
      return 'In Progress';
    case TaskStatus.COMPLETED:
      return 'Done';
    case TaskStatus.NOT_STARTED:
      return 'Upcoming';
  }
}
