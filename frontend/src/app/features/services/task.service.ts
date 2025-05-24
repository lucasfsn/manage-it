import { Project, User } from '@/app/features/dto/project.model';
import { Task, TaskData } from '@/app/features/dto/task.model';
import { ProjectService } from '@/app/features/services/project.service';
import { Response } from '@/app/shared/dto/response.model';
import { environment } from '@/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private task = signal<Task | null>(null);
  public loadedTask = this.task.asReadonly();

  public constructor(
    private http: HttpClient,
    private projectService: ProjectService,
  ) {}

  public createTask(project: Project, task: TaskData): Observable<Task> {
    return this.http
      .post<
        Response<Task>
      >(`${environment.apiUrl}/projects/${project.id}/tasks`, task)
      .pipe(
        tap((res: Response<Task>) => {
          const updatedProject = {
            ...project,
            tasks: [...project.tasks, res.data],
          };
          this.projectService.setProject(updatedProject);
        }),
        map((res: Response<Task>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public getTask(projectId: string, taskId: string): Observable<Task> {
    return this.http
      .get<
        Response<Task>
      >(`${environment.apiUrl}/projects/${projectId}/tasks/${taskId}`)
      .pipe(
        tap((res: Response<Task>) => {
          this.task.set(res.data);
        }),
        map((res: Response<Task>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public moveProjectTask(
    project: Project,
    updatedTask: Task,
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

          return throwError(() => err);
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
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public updateTask(
    projectId: string,
    taskId: string,
    updatedTask: TaskData,
  ): Observable<Task> {
    return this.http
      .patch<
        Response<Task>
      >(`${environment.apiUrl}/projects/${projectId}/tasks/${taskId}`, updatedTask)
      .pipe(
        tap((res: Response<Task>) => {
          this.task.set(res.data);
        }),
        map((res: Response<Task>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public addToTask(
    projectId: string,
    taskId: string,
    user: User,
  ): Observable<Response<Task>> {
    return this.http
      .patch<
        Response<Task>
      >(`${environment.apiUrl}/projects/${projectId}/tasks/${taskId}/user/add`, user)
      .pipe(
        tap((res: Response<Task>) => {
          this.task.set(res.data);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public removeFromTask(
    projectId: string,
    taskId: string,
    user: User,
  ): Observable<Response<Task>> {
    return this.http
      .patch<
        Response<Task>
      >(`${environment.apiUrl}/projects/${projectId}/tasks/${taskId}/user/remove`, user)
      .pipe(
        tap((res: Response<Task>) => {
          this.task.set(res.data);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }
}
