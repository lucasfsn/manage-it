import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { UserSummaryDto } from '@/app/shared/dto/user-summary.model';

export interface UserProfileProjectsDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: ProjectStatus;
  readonly members: UserSummaryDto[];
}

export interface UserProfileDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly username: string;
  readonly projects: UserProfileProjectsDto[];
  readonly createdAt: string;
  readonly email?: string;
}

export interface UpdateUserPayload {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password?: string;
}
