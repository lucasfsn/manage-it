import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { TaskPriority } from '@/app/modules/task/types/task-priority.type';
import { TaskStatus } from '@/app/modules/task/types/task-status.type';
import { UserSummaryDto } from '@/app/shared/dto/user-summary.model';

export interface TaskDto {
  readonly id: string;
  readonly projectId: string;
  readonly members: UserSummaryDto[];
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly dueDate: string;
  readonly projectStatus: ProjectStatus;
  readonly projectEndDate: string;
  readonly updatedAt: string;
}

export interface TaskPayload {
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly dueDate: string;
}
