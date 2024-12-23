import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ProjectService } from '../../features/services/project.service';

export const allowAddUserToProjectGuard: CanActivateFn = () => {
  const projectService = inject(ProjectService);
  const location = inject(Location);

  if (projectService.accessAddToProject) return true;

  location.back();

  return false;
};
