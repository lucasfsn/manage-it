import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, Task, TaskData, User } from '../dto/project.model';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public constructor(
    private http: HttpClient,
    private projectService: ProjectService
  ) {}

  private task = signal<Task | undefined>(undefined);

  public loadedTask = this.task.asReadonly();

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
        })
      );
  }

  public getTask(projectId: string, taskId: string): Observable<Task> {
    return this.http
      .get<Task>(`${environment.apiUrl}/projectss/${projectId}/tasks/${taskId}`)
      .pipe(
        tap((res: Task) => {
          this.task.set(res);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public moveProjectTask(
    project: Project,
    updatedTask: Task
  ): Observable<null> {
    const prevTask = this.task();

    const updatedProjectTasksList = project.tasks.map((t) =>
      t.id === updatedTask.id ? { ...t, status: updatedTask.status } : t
    );

    this.projectService.setProject({
      ...project,
      tasks: updatedProjectTasksList,
    });

    this.task.set(updatedTask);

    return this.http
      .patch<null>(
        `${environment.apiUrl}/projects/${project.id}/tasks/${updatedTask.id}`,
        { status: updatedTask.status }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.projectService.setProject(project);
          this.task.set(prevTask);

          return throwError(() => err);
        })
      );
  }

  public deleteTask(projectId: string, taskId: string): Observable<null> {
    return this.http
      .delete<null>(
        `${environment.apiUrl}/projects/${projectId}/tasks/${taskId}`
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public updateTask(
    projectId: string,
    taskId: string,
    updatedTask: TaskData
  ): Observable<null> {
    return this.http
      .patch<null>(
        `${environment.apiUrl}/projects/${projectId}/tasks/${taskId}`,
        updatedTask
      )
      .pipe(
        tap(() => {
          // res: Task  // TODO:

          const task = this.task()!;
          this.task.set({ ...task, ...updatedTask });

          // this.task.set(res)
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public addToTask(
    projectId: string,
    taskId: string,
    user: User
  ): Observable<null> {
    return this.http
      .patch<null>(
        `${environment.apiUrl}/projects/${projectId}/tasks/${taskId}/user/add`,
        user
      )
      .pipe(
        tap(() => {
          // res: Task  // TODO:

          const task = this.task()!;
          const updatedTaskMembers = [...task.members, user];
          const updatedTask = { ...task, members: updatedTaskMembers };
          this.task.set(updatedTask);

          // this.task.set(res)
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public removeFromTask(
    projectId: string,
    taskId: string,
    user: User
  ): Observable<null> {
    return this.http
      .patch<null>(
        `${environment.apiUrl}/projects/${projectId}/tasks/${taskId}/user/remove`,
        user
      )
      .pipe(
        tap(() => {
          // res: Task  // TODO:

          const task = this.task()!;
          const updatedTaskMembers = task.members.filter(
            (u) => u.username !== user.username
          );
          const updatedTask = { ...task, members: updatedTaskMembers };
          this.task.set(updatedTask);

          // this.task.set(res)
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }
}
