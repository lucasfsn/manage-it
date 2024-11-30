import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProjectService } from '../../features/services/project.service';

export const addToProjectGuard: CanActivateFn = (route, state) => {
  const projectService = inject(ProjectService);
  const router = inject(Router);

  if (projectService.allowAccessToAddToProject) {
    return true;
  } else {
    const username = route.paramMap.get('username');
    router.navigate(['/users', username]);
    return false;
  }
};
