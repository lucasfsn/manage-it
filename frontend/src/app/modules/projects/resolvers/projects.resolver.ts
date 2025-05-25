import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { ProjectDto } from '@/app/features/dto/project.dto';
import { ProjectService } from '@/app/features/services/project.service';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';

export const projectsResolver: ResolveFn<ProjectDto[]> = () => {
  const loadingService = inject(LoadingService);
  const projectService = inject(ProjectService);
  const toastrService = inject(ToastrService);
  const mapperService = inject(MapperService);

  loadingService.loadingOn();

  return projectService.getProjects().pipe(
    catchError((error: ErrorResponse) => {
      const localeMessage = mapperService.errorToastMapper(error.code);
      toastrService.error(localeMessage);

      return of([]);
    }),
    finalize(() => loadingService.loadingOff()),
  );
};
