import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Project,
  ProjectRequest,
  ProjectStatus,
  User,
} from '../dto/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  private allowAccess = false;

  private projects = signal<Project[] | undefined>(undefined);
  private project = signal<Project | undefined>(undefined);

  public loadedProjects = this.projects.asReadonly();
  public loadedProject = this.project.asReadonly();

  public getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/projects`).pipe(
      tap((res: Project[]) => {
        this.projects.set(res);
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err.error);
      })
    );
  }

  public createProject(project: ProjectRequest): Observable<string> {
    return this.http
      .post<Project>(`${environment.apiUrl}/projects`, project)
      .pipe(
        tap((res: Project) => {
          const prevProjects = this.projects();

          if (!prevProjects) return;

          this.projects.set([...prevProjects, res]);
        }),
        map((res: Project) => res.id),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error);
        })
      );
  }

  public getProject(projectId: string): Observable<Project> {
    return this.http
      .get<Project>(`${environment.apiUrl}/projects/${projectId}`)
      .pipe(
        tap((res: Project) => {
          this.project.set(res);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error);
        })
      );
  }

  public deleteProject(projectId: string): Observable<null> {
    return this.http
      .delete<null>(`${environment.apiUrl}/projects/${projectId}`)
      .pipe(
        tap(() => {
          const prevProjects = this.projects();

          if (!prevProjects) return;

          const updatedProjects = prevProjects.filter(
            (p) => p.id !== projectId
          );

          this.projects.set(updatedProjects);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error);
        })
      );
  }

  public updateProject(
    projectId: string,
    updatedProject: ProjectRequest
  ): Observable<null> {
    const prevProject = this.project();

    if (!prevProject)
      return throwError(
        () => new Error('Something went wrong. Project not found')
      );

    this.project.set({ ...prevProject, ...updatedProject });

    return this.http
      .patch<null>(
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

  public completeProject(): Observable<null> {
    const prevProject = this.project();

    if (!prevProject)
      return throwError(
        () => new Error('Something went wrong. Project not found')
      );

    const updatedProject = { ...prevProject, status: ProjectStatus.COMPLETED };

    this.project.set(updatedProject);

    return this.http
      .patch<null>(`${environment.apiUrl}/projects/${prevProject.id}`, {
        status: ProjectStatus.COMPLETED,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.project.set(prevProject);

          return throwError(() => err.error);
        })
      );
  }

  public addToProject(projectId: string, user: User): Observable<null> {
    return this.http
      .patch<null>(`${environment.apiUrl}/projects/${projectId}/user/add`, user)
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

  public removeFromProject(user: User): Observable<null> {
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
      .patch<null>(
        `${environment.apiUrl}/projects/${prevProject.id}/user/remove`,
        user
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.project.set(prevProject);

          return throwError(() => err.error);
        })
      );
  }

  public setProject(project: Project): void {
    this.project.set(project);
  }

  public get allowAccessToAddToProject(): boolean {
    return this.allowAccess;
  }

  public set allowAccessToAddToProject(value: boolean) {
    this.allowAccess = value;
  }
}
