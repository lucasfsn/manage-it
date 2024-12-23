import { ProjectStatus } from '../../../features/dto/project.model';

export interface ProjectsFilters {
  readonly name?: string;
  readonly status?: ProjectStatus;
  readonly onlyOwnedByMe: boolean;
}
