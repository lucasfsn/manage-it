import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { Project } from '../../../features/dto/project.model';
import { LoadingService } from '../../../features/services/loading.service';
import { MappersService } from '../../../features/services/mappers.service';
import { ProjectService } from '../../../features/services/project.service';

export const dashboardResolver: ResolveFn<Project[] | undefined> = () => {
  const loadingService = inject(LoadingService);
  const projectService = inject(ProjectService);
  const mappersService = inject(MappersService);
  const toastrService = inject(ToastrService);

  loadingService.loadingOn();

  return projectService.getProjects().pipe(
    catchError(() => {
      const localeMessage = mappersService.errorToastMapper();
      toastrService.error(localeMessage);

      return of(undefined);
    }),
    finalize(() => loadingService.loadingOff())
  );
};
