import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProjectService } from '../../features/services/project.service';

export const allowAddUserToProjectGuard: CanActivateFn = () => {
  const projectService = inject(ProjectService);
  const router = inject(Router);

  if (projectService.accessAddToProject) return true;

  router.navigate(['/']);

  return false;
};
