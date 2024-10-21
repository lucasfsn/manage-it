import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProjectService } from '../services/project.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};

export const projectAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const projectService = inject(ProjectService);
  const router = inject(Router);

  const userName = authService.getLoggedInUser()?.userName!;
  const projectId = route.paramMap.get('projectId');

  if (projectId && projectService.hasAccessToProject(userName, projectId)) {
    return true;
  } else {
    router.navigate(['/projects']);
    return false;
  }
};
