import { Priority } from '../../features/dto/project.model';

export function priorityMapper(priority: Priority): string {
  switch (priority) {
    case Priority.LOW:
      return 'Low';
    case Priority.MEDIUM:
      return 'Medium';
    case Priority.HIGH:
      return 'High';
  }
}
