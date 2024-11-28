import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Project,
  ProjectCreate,
  ProjectStatus,
  ProjectUpdate,
  Task,
  TaskCreate,
  TaskUpdate,
  User,
} from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  private allowAccess = false;

  private projects = signal<Project[] | undefined>(undefined);
  private project = signal<Project | undefined>(undefined);
  private task = signal<Task | undefined>(undefined);

  loadedProjects = this.projects.asReadonly();
  loadedProject = this.project.asReadonly();
  loadedTask = this.task.asReadonly();

  getProjects() {
    return this.http.get<Project[]>(`${environment.apiUrl}/projects`).pipe(
      tap((res: Project[]) => {
        this.projects.set(res);
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err.error);
      })
    );
  }

  addProject(project: ProjectCreate) {
    return this.http
      .post<Project>(`${environment.apiUrl}/projects`, project)
      .pipe(
        map((res: Project) => res.id),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error);
        })
      );
  }

  getProject(projectId: string) {
    return this.http
      .get<Project>(`${environment.apiUrl}/projects/${projectId}`)
      .pipe(
        tap((res: Project) => {
          console.log(res);
          this.project.set(res);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error);
        })
      );
  }

  deleteProject(projectId: string) {
    return this.http
      .delete<Project>(`${environment.apiUrl}/projects/${projectId}`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error);
        })
      );
  }

  updateProject(projectId: string, updatedProject: ProjectUpdate) {
    const prevProject = this.project();

    if (!prevProject)
      return throwError(
        () => new Error('Something went wrong. Project not found')
      );

    this.project.set({ ...prevProject, ...updatedProject });

    return this.http
      .put<Project>(
        `${environment.apiUrl}/projects/${projectId}`,
        updatedProject
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.project.set(prevProject);
          return throwError(() => err.error);
        })
      );
  }

  completeProject() {
    const prevProject = this.project();

    if (!prevProject)
      return throwError(
        () => new Error('Something went wrong. Project not found')
      );

    const updatedProject = { ...prevProject, status: ProjectStatus.Completed };

    this.project.set(updatedProject);

    return this.http
      .get<Project>(`${environment.apiUrl}/projects/${prevProject.id}/complete`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.project.set(prevProject);
          return throwError(() => err.error);
        })
      );
  }

  addToProject(projectId: string, user: User) {
    return this.http
      .put<Project>(
        `${environment.apiUrl}/projects/${projectId}/user/add`,
        user
      )
      .pipe(
        tap(() => {
          this.allowAccessToAddToProject = false;
        }),
        catchError((err: HttpErrorResponse) => {
          this.allowAccessToAddToProject = false;
          return throwError(() => err.error);
        })
      );
  }

  removeFromProject(user: User) {
    const prevProject = this.project();

    if (!prevProject)
      return throwError(
        () => new Error('Something went wrong. Project not found')
      );

    const updatedProjectMembers = prevProject.members.filter(
      (u) => u.username !== user.username
    );

    this.project.set({ ...prevProject, members: updatedProjectMembers });

    return this.http
      .put<Project>(
        `${environment.apiUrl}/projects/${prevProject.id}/user/add`,
        user
      )
      .pipe(
        tap(() => {}),
        catchError((err: HttpErrorResponse) => {
          this.project.set(prevProject);
          return throwError(() => err.error);
        })
      );
  }

  moveProjectTask(updatedTask: Task) {
    const prevProject = this.project();

    if (!prevProject)
      return throwError(
        () => new Error('Something went wrong. Project not found')
      );

    const updatedProjectTasksList = prevProject.tasks.map((t) =>
      t.id === updatedTask.id ? { ...t, status: updatedTask.status } : t
    );

    this.project.set({ ...prevProject, tasks: updatedProjectTasksList });

    return this.http
      .put<Task>(
        `${environment.apiUrl}/projects/${prevProject.id}/tasks/${updatedTask.id}`,
        { status: updatedTask.status }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.project.set(prevProject);
          return throwError(() => err.error);
        })
      );
  }

  addTask(task: TaskCreate) {
    const prevProject = this.project();

    if (!prevProject)
      return throwError(
        () => new Error('Something went wrong. Project not found')
      );

    return this.http
      .post<Task>(
        `${environment.apiUrl}/projects/${prevProject.id}/tasks`,
        task
      )
      .pipe(
        tap((res: Task) => {
          const updatedProject = {
            ...prevProject,
            tasks: [...prevProject.tasks, res],
          };
          this.project.set(updatedProject);
        }),
        catchError((err: HttpErrorResponse) => {
          this.project.set(prevProject);
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

  updateTask(updatedTask: TaskUpdate) {
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

  get allowAccessToAddToProject(): boolean {
    return this.allowAccess;
  }

  set allowAccessToAddToProject(value: boolean) {
    this.allowAccess = value;
  }

  areProjectsLoaded(): boolean {
    return !!this.projects();
  }

  hasAccessToProject(username: string, projectId: string): boolean {
    const projects = this.projects();
    const project = projects?.find((p) => p.id === projectId);

    if (!project) return false;

    return project.members.some((member) => member.username === username);
  }
}
