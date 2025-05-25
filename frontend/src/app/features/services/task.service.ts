import { ProjectDto } from '@/app/features/dto/project.dto';
import { TaskDto, TaskPayload } from '@/app/features/dto/task.dto';
import { ProjectService } from '@/app/features/services/project.service';
import { UserSummaryDto } from '@/app/shared/dto/user-summary.dto';
import { Response } from '@/app/shared/types/response.type';
import { handleApiError } from '@/app/shared/utils/handle-api-error.util';
import { environment } from '@/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private task = signal<TaskDto | null>(null);
  public loadedTask = this.task.asReadonly();

  public constructor(
    private http: HttpClient,
    private projectService: ProjectService,
  ) {}

  public createTask(
    project: ProjectDto,
    task: TaskPayload,
  ): Observable<TaskDto> {
    return this.http
      .post<
        Response<TaskDto>
      >(`${environment.apiUrl}/projects/${project.id}/tasks`, task)
      .pipe(
        tap((res: Response<TaskDto>) => {
          const updatedProject = {
            ...project,
            tasks: [...project.tasks, res.data],
          };
          this.projectService.setProject(updatedProject);
        }),
        map((res: Response<TaskDto>) => res.data),
        catchError(handleApiError),
      );
  }

  public getTask(projectId: string, taskId: string): Observable<TaskDto> {
    return this.http
      .get<
        Response<TaskDto>
      >(`${environment.apiUrl}/projects/${projectId}/tasks/${taskId}`)
      .pipe(
        tap((res: Response<TaskDto>) => this.task.set(res.data)),
        map((res: Response<TaskDto>) => res.data),
        catchError(handleApiError),
      );
  }

  public moveProjectTask(
    project: ProjectDto,
    updatedTask: TaskDto,
  ): Observable<null> {
    const prevTask = this.task();

    const updatedProjectTasksList = project.tasks.map((t) =>
      t.id === updatedTask.id ? { ...t, status: updatedTask.status } : t,
    );

    this.projectService.setProject({
      ...project,
      tasks: updatedProjectTasksList,
    });

    this.task.set(updatedTask);

    return this.http
      .patch<
        Response<null>
      >(`${environment.apiUrl}/projects/${project.id}/tasks/${updatedTask.id}`, { status: updatedTask.status })
      .pipe(
        map((res: Response<null>) => res.data),
        catchError((err: HttpErrorResponse) => {
          this.projectService.setProject(project);
          this.task.set(prevTask);

          return handleApiError(err);
        }),
      );
  }

  public deleteTask(projectId: string, taskId: string): Observable<null> {
    return this.http
      .delete<
        Response<null>
      >(`${environment.apiUrl}/projects/${projectId}/tasks/${taskId}`)
      .pipe(
        map((res: Response<null>) => res.data),
        catchError(handleApiError),
      );
  }

  public updateTask(
    projectId: string,
    taskId: string,
    updatedTask: TaskPayload,
  ): Observable<TaskDto> {
    return this.http
      .patch<
        Response<TaskDto>
      >(`${environment.apiUrl}/projects/${projectId}/tasks/${taskId}`, updatedTask)
      .pipe(
        tap((res: Response<TaskDto>) => this.task.set(res.data)),
        map((res: Response<TaskDto>) => res.data),
        catchError(handleApiError),
      );
  }

  public addToTask(
    projectId: string,
    taskId: string,
    user: UserSummaryDto,
  ): Observable<TaskDto> {
    return this.http
      .patch<
        Response<TaskDto>
      >(`${environment.apiUrl}/projects/${projectId}/tasks/${taskId}/user/add`, user)
      .pipe(
        tap((res: Response<TaskDto>) => this.task.set(res.data)),
        map((res: Response<TaskDto>) => res.data),
        catchError(handleApiError),
      );
  }

  public removeFromTask(
    projectId: string,
    taskId: string,
    user: UserSummaryDto,
  ): Observable<TaskDto> {
    return this.http
      .patch<
        Response<TaskDto>
      >(`${environment.apiUrl}/projects/${projectId}/tasks/${taskId}/user/remove`, user)
      .pipe(
        tap((res: Response<TaskDto>) => this.task.set(res.data)),
        map((res: Response<TaskDto>) => res.data),
        catchError(handleApiError),
      );
  }
}
