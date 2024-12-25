import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { LoadingService } from '../../../core/services/loading.service';
import { MapperService } from '../../../core/services/mapper.service';
import { Project } from '../../../features/dto/project.model';
import { ProjectService } from '../../../features/services/project.service';

export const projectResolver: ResolveFn<Project | null> = (route) => {
  const loadingService = inject(LoadingService);
  const projectService = inject(ProjectService);
  const mapperService = inject(MapperService);
  const toastrService = inject(ToastrService);
  const location = inject(Location);

  const projectId = route.paramMap.get('projectId');
  if (projectId) {
    loadingService.loadingOn();

    return projectService.getProject(projectId).pipe(
      catchError((error) => {
        const localeMessage = mapperService.errorToastMapper(error.status);
        toastrService.error(localeMessage);
        location.back();

        return of(null);
      }),
      finalize(() => loadingService.loadingOff())
    );
  }

  return of(null);
};
