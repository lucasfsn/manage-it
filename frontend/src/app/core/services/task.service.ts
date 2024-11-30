import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task, TaskData, User } from '../models/project.model';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private http: HttpClient,
    private projectService: ProjectService
  ) {}

  private task = signal<Task | undefined>(undefined);

  loadedTask = this.task.asReadonly();

  createTask(task: TaskData) {
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

  getTask(projectId: string, taskId: string) {
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

  moveProjectTask(updatedTask: Task) {
    const project = this.projectService.loadedProject();

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

    return this.http
      .put<Task>(
        `${environment.apiUrl}/projects/${project.id}/tasks/${updatedTask.id}`,
        { status: updatedTask.status }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.projectService.setProject(project);
          return throwError(() => err.error);
        })
      );
  }

  updateTask(updatedTask: TaskData) {
    const prevTask = this.task();

    if (!prevTask)
      return throwError(
        () => new Error('Something went wrong. Task not found')
      );

    this.task.set({ ...prevTask, ...updatedTask });

    return this.http
      .put<Task>(
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

  addToTask(user: User) {
    const prevTask = this.task();

    if (!prevTask)
      return throwError(
        () => new Error('Something went wrong. Task not found')
      );

    const updatedTaskMembers = prevTask?.users
      ? [...prevTask.users, user]
      : [user];

    const updatedTask = { ...prevTask, users: updatedTaskMembers };

    this.task.set(updatedTask);

    return this.http
      .put<Task>(
        `${environment.apiUrl}/projects/${prevTask.projectId}/tasks/${prevTask.id}/user/add`,
        user
      )
      .pipe(
        tap(() => {}),
        catchError((err: HttpErrorResponse) => {
          this.task.set(prevTask);
          return throwError(() => err.error);
        })
      );
  }

  removeFromTask(user: User) {
    const prevTask = this.task();

    if (!prevTask)
      return throwError(
        () => new Error('Something went wrong. Task not found')
      );

    const updatedTaskMembers = prevTask.users.filter(
      (u) => u.username !== user.username
    );

    const updatedTask = { ...prevTask, users: updatedTaskMembers };

    this.task.set(updatedTask);

    return this.http
      .put<Task>(
        `${environment.apiUrl}/projects/${prevTask.projectId}/tasks/${prevTask.id}/user/remove`,
        user
      )
      .pipe(
        tap(() => {}),
        catchError((err: HttpErrorResponse) => {
          this.task.set(prevTask);
          return throwError(() => err.error);
        })
      );
  }
}
