import { ProjectStatus } from '../../../features/dto/project.model';

export interface ProjectFilters {
  name?: string;
  status?: ProjectStatus;
  onlyOwnedByMe: boolean;
}
