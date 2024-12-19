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
  public constructor(private http: HttpClient) {}

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

  public createProject(newProject: ProjectRequest): Observable<string> {
    return this.http
      .post<Project>(`${environment.apiUrl}/projects`, newProject)
      .pipe(
        tap((res: Project) => {
          const projects = this.projects();

          this.projects.set([...(projects ?? []), res]);
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
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error);
        })
      );
  }

  public updateProject(
    projectId: string,
    updatedProject: ProjectRequest
  ): Observable<null> {
    return this.http
      .patch<null>(
        `${environment.apiUrl}/projects/${projectId}`,
        updatedProject
      )
      .pipe(
        tap(() => {
          // res: Project; // TODO:

          const prevProject = this.project()!;

          this.project.set({ ...prevProject, ...updatedProject });
          // this.project.set(res)
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error);
        })
      );
  }

  public completeProject(project: Project): Observable<null> {
    return this.http
      .patch<null>(`${environment.apiUrl}/projects/${project.id}`, {
        status: ProjectStatus.COMPLETED,
      })
      .pipe(
        tap(() => {
          this.project.set({ ...project, status: ProjectStatus.COMPLETED });
        }),
        catchError((err: HttpErrorResponse) => {
          this.project.set(project);

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

  public removeFromProject(user: User, projectId: string): Observable<null> {
    return this.http
      .patch<null>(
        `${environment.apiUrl}/projects/${projectId}/user/remove`,
        user
      )
      .pipe(
        tap(() => {
          // res: Project; // TODO:

          const prevProject = this.project()!;
          const updatedProjectMembers = prevProject.members.filter(
            (u) => u.username !== user.username
          );
          this.project.set({ ...prevProject, members: updatedProjectMembers });

          // this.project.set(res)
        }),
        catchError((err: HttpErrorResponse) => {
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
