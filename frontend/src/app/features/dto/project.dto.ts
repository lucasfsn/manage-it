import { TaskDto } from '@/app/features/dto/task.dto';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { UserSummaryDto } from '@/app/shared/dto/user-summary.dto';

export interface ProjectDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly createdAt: string;
  readonly endDate: string;
  readonly completedTasks: number;
  readonly totalTasks: number;
  readonly status: ProjectStatus;
  readonly owner: UserSummaryDto;
  readonly members: UserSummaryDto[];
  readonly tasks: TaskDto[];
}

export interface ProjectPayload {
  readonly name: string;
  readonly description: string;
  readonly endDate: string;
}
