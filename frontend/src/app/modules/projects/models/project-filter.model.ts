import { ProjectStatus } from '../../../features/dto/project.model';

export interface ProjectFilters {
  name: string;
  status: ProjectStatus | undefined;
  ownedByCurrentUser: boolean;
}
