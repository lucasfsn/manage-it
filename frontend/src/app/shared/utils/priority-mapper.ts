import { Priority } from '../../core/models/project.model';

export function priorityMapper(priority: Priority): string {
  switch (priority) {
    case Priority.Low:
      return 'Low';
    case Priority.Medium:
      return 'Medium';
    case Priority.High:
      return 'High';
    default:
      return 'In Progress';
  }
}
