import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { Project } from '../../../features/dto/project.model';
import { AuthService } from '../../../features/services/auth.service';
import { LoadingService } from '../../../features/services/loading.service';
import { MapperService } from '../../../features/services/mapper.service';
import { ProjectService } from '../../../features/services/project.service';

export const projectsResolver: ResolveFn<Project[] | undefined> = () => {
  const loadingService = inject(LoadingService);
  const projectService = inject(ProjectService);
  const authService = inject(AuthService);
  const toastrService = inject(ToastrService);
  const mapperService = inject(MapperService);

  const username = authService.getLoggedInUsername();
  if (username) {
    loadingService.loadingOn();

    return projectService.getProjects().pipe(
      catchError(() => {
        const localeMessage = mapperService.errorToastMapper();
        toastrService.error(localeMessage);

        return of(undefined);
      }),
      finalize(() => loadingService.loadingOff())
    );
  }

  return of(undefined);
};
