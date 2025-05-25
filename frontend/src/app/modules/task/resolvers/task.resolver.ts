import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { TaskDto } from '@/app/features/dto/task.model';
import { TaskService } from '@/app/features/services/task.service';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';

export const taskResolver: ResolveFn<TaskDto | null> = (route) => {
  const loadingService = inject(LoadingService);
  const taskService = inject(TaskService);
  const mapperService = inject(MapperService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  loadingService.loadingOn();

  const projectId = route.paramMap.get('projectId');
  const taskId = route.paramMap.get('taskId');

  if (projectId && taskId) {
    loadingService.loadingOn();

    return taskService.getTask(projectId, taskId).pipe(
      catchError((error: ErrorResponse) => {
        const localeMessage = mapperService.errorToastMapper(
          error.code,
          'task',
        );
        toastrService.error(localeMessage);

        const redirectUrl =
          error.code === 404 ? `/projects/${projectId}` : '/projects';
        router.navigate([redirectUrl]);

        return of(null);
      }),
      finalize(() => loadingService.loadingOff()),
    );
  }

  return of(null);
};
