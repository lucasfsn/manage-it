import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { LoadingService } from '../../../core/services/loading.service';
import { MapperService } from '../../../core/services/mapper.service';
import { Project } from '../../../features/dto/project.model';
import { ProjectService } from '../../../features/services/project.service';

export const projectsResolver: ResolveFn<Project[]> = () => {
  const loadingService = inject(LoadingService);
  const projectService = inject(ProjectService);
  const toastrService = inject(ToastrService);
  const mapperService = inject(MapperService);

  loadingService.loadingOn();

  return projectService.getProjects().pipe(
    catchError(() => {
      const localeMessage = mapperService.errorToastMapper();
      toastrService.error(localeMessage);

      return of([]);
    }),
    finalize(() => loadingService.loadingOff())
  );
};
