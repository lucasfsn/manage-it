import { ProjectStatus } from '@/app/features/dto/project.model';

export interface ProjectsFilters {
  readonly name: string;
  readonly status: ProjectStatus | null;
  readonly ownedByCurrentUser: boolean;
}
