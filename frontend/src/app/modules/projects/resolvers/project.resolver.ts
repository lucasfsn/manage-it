import { LoadingService } from '@/app/core/services/loading.service';
import { Project } from '@/app/features/dto/project.model';
import { ProjectService } from '@/app/features/services/project.service';
import { MapperService } from '@/app/shared/services/mapper.service';
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';

export const projectResolver: ResolveFn<Project | null> = (route) => {
  const loadingService = inject(LoadingService);
  const projectService = inject(ProjectService);
  const mapperService = inject(MapperService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  const projectId = route.paramMap.get('projectId');
  if (projectId) {
    loadingService.loadingOn();

    return projectService.getProject(projectId).pipe(
      catchError((error) => {
        const localeMessage = mapperService.errorToastMapper(error.status);
        toastrService.error(localeMessage);
        router.navigate(['/projects']);

        return of(null);
      }),
      finalize(() => loadingService.loadingOff()),
    );
  }

  return of(null);
};
