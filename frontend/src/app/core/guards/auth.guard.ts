import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
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
  const projectService = inject(ProjectService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUser().pipe(
    switchMap((user) => {
      const userName = user?.userName;

      if (!userName) {
        router.navigate(['/auth/login']);
        return of(false);
      }

      const projectId = route.paramMap.get('projectId');

      if (!projectId) {
        router.navigate(['/projects']);
        return of(false);
      }

      if (projectService.areProjectsLoaded()) {
        const hasAccess = projectService.hasAccessToProject(
          userName,
          projectId
        );

        if (hasAccess) return of(true);

        router.navigate(['/projects']);
        return of(false);
      }

      return projectService.getProjects(userName).pipe(
        switchMap(() => {
          const hasAccess = projectService.hasAccessToProject(
            userName,
            projectId
          );

          if (hasAccess) return of(true);

          router.navigate(['/projects']);
          return of(false);
        }),
        tap({
          error: (error) => {
            console.error('Error loading projects:', error);
            router.navigate(['/projects']);
          },
        })
      );
    })
  );
};
