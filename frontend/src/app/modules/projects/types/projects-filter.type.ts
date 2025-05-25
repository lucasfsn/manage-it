import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';

export interface ProjectsFilters {
  readonly name: string;
  readonly status: ProjectStatus | null;
  readonly ownedByCurrentUser: boolean;
}
