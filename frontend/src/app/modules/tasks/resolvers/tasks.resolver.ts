import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { Task } from '../../../features/dto/project.model';
import { LoadingService } from '../../../features/services/loading.service';
import { MappersService } from '../../../features/services/mappers.service';
import { TaskService } from '../../../features/services/task.service';

export const tasksResolver: ResolveFn<Task | undefined> = (route) => {
  const loadingService = inject(LoadingService);
  const taskService = inject(TaskService);
  const mappersService = inject(MappersService);
  const toastrService = inject(ToastrService);
  const location = inject(Location);

  loadingService.loadingOn();

  const projectId = route.paramMap.get('projectId');
  const taskId = route.paramMap.get('taskId');

  if (projectId && taskId) {
    loadingService.loadingOn();

    return taskService.getTask(projectId, taskId).pipe(
      catchError((error) => {
        const localeMessage = mappersService.errorToastMapper(error.status);
        toastrService.error(localeMessage);
        location.back();

        return of(undefined);
      }),
      finalize(() => loadingService.loadingOff())
    );
  }

  return of(undefined);
};
