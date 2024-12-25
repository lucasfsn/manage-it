import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { LoadingService } from '../../../core/services/loading.service';
import { MapperService } from '../../../core/services/mapper.service';
import { Task } from '../../../features/dto/task.model';
import { TaskService } from '../../../features/services/task.service';

export const taskResolver: ResolveFn<Task | null> = (route) => {
  const loadingService = inject(LoadingService);
  const taskService = inject(TaskService);
  const mapperService = inject(MapperService);
  const toastrService = inject(ToastrService);
  const location = inject(Location);

  loadingService.loadingOn();

  const projectId = route.paramMap.get('projectId');
  const taskId = route.paramMap.get('taskId');

  if (projectId && taskId) {
    loadingService.loadingOn();

    return taskService.getTask(projectId, taskId).pipe(
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
