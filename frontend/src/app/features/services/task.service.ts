import { Project, User } from '@/app/features/dto/project.model';
import { Task, TaskData } from '@/app/features/dto/task.model';
import { ProjectService } from '@/app/features/services/project.service';
import { environment } from '@/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

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
      .post<Task>(`${environment.apiUrl}/projects/${project.id}/tasks`, task)
      .pipe(
        tap((res: Task) => {
          const updatedProject = {
            ...project,
            tasks: [...project.tasks, res],
          };
          this.projectService.setProject(updatedProject);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public getTask(projectId: string, taskId: string): Observable<Task> {
    return this.http
      .get<Task>(`${environment.apiUrl}/projects/${projectId}/tasks/${taskId}`)
      .pipe(
        tap((res: Task) => {
          this.task.set(res);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public moveProjectTask(
    project: Project,
    updatedTask: Task,
  ): Observable<string> {
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
      .patch(
        `${environment.apiUrl}/projects/${project.id}/tasks/${updatedTask.id}`,
        { status: updatedTask.status },
        {
          responseType: 'text',
        },
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.projectService.setProject(project);
          this.task.set(prevTask);

          return throwError(() => err);
        }),
      );
  }

  public deleteTask(projectId: string, taskId: string): Observable<string> {
    return this.http
      .delete(`${environment.apiUrl}/projects/${projectId}/tasks/${taskId}`, {
        responseType: 'text',
      })
      .pipe(
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
      .patch<Task>(
        `${environment.apiUrl}/projects/${projectId}/tasks/${taskId}`,
        updatedTask,
      )
      .pipe(
        tap((res: Task) => {
          this.task.set(res);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public addToTask(
    projectId: string,
    taskId: string,
    user: User,
  ): Observable<Task> {
    return this.http
      .patch<Task>(
        `${environment.apiUrl}/projects/${projectId}/tasks/${taskId}/user/add`,
        user,
      )
      .pipe(
        tap((res: Task) => {
          this.task.set(res);
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
  ): Observable<Task> {
    return this.http
      .patch<Task>(
        `${environment.apiUrl}/projects/${projectId}/tasks/${taskId}/user/remove`,
        user,
      )
      .pipe(
        tap((res: Task) => {
          this.task.set(res);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }
}
