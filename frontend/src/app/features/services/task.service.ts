import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task, TaskData, User } from '../dto/project.model';
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

  public createTask(task: TaskData): Observable<Task> {
    const project = this.projectService.loadedProject();

    if (!project)
      return throwError(
        () => new Error('Something went wrong. Project not found')
      );

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
          this.projectService.setProject(project);

          return throwError(() => err.error);
        })
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
          return throwError(() => err.error);
        })
      );
  }

  public moveProjectTask(updatedTask: Task): Observable<null> {
    const project = this.projectService.loadedProject();
    const prevTask = this.task();

    if (!project)
      return throwError(
        () => new Error('Something went wrong. Project not found')
      );

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

          return throwError(() => err.error);
        })
      );
  }

  public deleteTask(): Observable<null> {
    const projectId = this.task()?.projectId;
    const taskId = this.task()?.id;

    if (!projectId || !taskId)
      return throwError(() => new Error('Something went wrong'));

    return this.http
      .delete<null>(
        `${environment.apiUrl}/projects/${projectId}/tasks/${taskId}`
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error);
        })
      );
  }

  public updateTask(updatedTask: TaskData): Observable<null> {
    const prevTask = this.task();

    if (!prevTask)
      return throwError(
        () => new Error('Something went wrong. Task not found')
      );

    this.task.set({ ...prevTask, ...updatedTask });

    return this.http
      .patch<null>(
        `${environment.apiUrl}/projects/${prevTask.projectId}/tasks/${prevTask.id}`,
        updatedTask
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.task.set(prevTask);

          return throwError(() => err.error);
        })
      );
  }

  public addToTask(user: User): Observable<null> {
    const prevTask = this.task();

    if (!prevTask)
      return throwError(
        () => new Error('Something went wrong. Task not found')
      );

    const updatedTaskMembers = [...prevTask.members, user];

    const updatedTask = { ...prevTask, members: updatedTaskMembers };

    this.task.set(updatedTask);

    return this.http
      .patch<null>(
        `${environment.apiUrl}/projects/${prevTask.projectId}/tasks/${prevTask.id}/user/add`,
        user
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.task.set(prevTask);

          return throwError(() => err.error);
        })
      );
  }

  public removeFromTask(user: User): Observable<null> {
    const prevTask = this.task();

    if (!prevTask)
      return throwError(
        () => new Error('Something went wrong. Task not found')
      );

    const updatedTaskMembers = prevTask.members.filter(
      (u) => u.username !== user.username
    );

    const updatedTask = { ...prevTask, members: updatedTaskMembers };

    this.task.set(updatedTask);

    return this.http
      .patch<null>(
        `${environment.apiUrl}/projects/${prevTask.projectId}/tasks/${prevTask.id}/user/remove`,
        user
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.task.set(prevTask);

          return throwError(() => err.error);
        })
      );
  }
}
