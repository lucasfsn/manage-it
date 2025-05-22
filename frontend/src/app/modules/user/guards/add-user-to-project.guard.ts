import { ProjectService } from '@/app/features/services/project.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const addUserToProjectGuard: CanActivateFn = () => {
  const projectService = inject(ProjectService);
  const router = inject(Router);

  if (projectService.accessAddToProject) return true;

  router.navigate(['/']);

  return false;
};
