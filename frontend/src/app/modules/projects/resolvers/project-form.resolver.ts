import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { ProjectDto } from '@/app/features/dto/project.dto';
import { ProjectService } from '@/app/features/services/project.service';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, map, of } from 'rxjs';

export const projectFormResolver: ResolveFn<ProjectDto | null> = (route) => {
  const loadingService = inject(LoadingService);
  const projectService = inject(ProjectService);
  const mapperService = inject(MapperService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  const projectId = route.paramMap.get('projectId');
  if (projectId) {
    loadingService.loadingOn();

    return projectService.getProject(projectId).pipe(
      map((project) => {
        if (project.status !== ProjectStatus.COMPLETED) return project;

        router.navigate(['/projects', project.id]);

        return null;
      }),
      catchError((error: ErrorResponse) => {
        const localeMessage = mapperService.errorToastMapper(
          error.code,
          'project',
        );
        toastrService.error(localeMessage);
        router.navigate(['/projects']);

        return of(null);
      }),
      finalize(() => loadingService.loadingOff()),
    );
  }

  return of(null);
};
