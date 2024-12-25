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
  private allowAddToProject: boolean = false;
  private projects = signal<Project[]>([]);
  private project = signal<Project | null>(null);

  public loadedProjects = this.projects.asReadonly();
  public loadedProject = this.project.asReadonly();

  public constructor(private http: HttpClient) {}

  public get accessAddToProject(): boolean {
    return this.allowAddToProject;
  }

  public getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/projects`).pipe(
      tap((res: Project[]) => {
        this.projects.set(res);
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      })
    );
  }

  public createProject(newProject: ProjectRequest): Observable<string> {
    return this.http
      .post<Project>(`${environment.apiUrl}/projects`, newProject)
      .pipe(
        tap((res: Project) => {
          this.projects.update((projects) => [...projects, res]);
        }),
        map((res: Project) => res.id),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
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
          return throwError(() => err);
        })
      );
  }

  public deleteProject(projectId: string): Observable<string> {
    return this.http
      .delete(`${environment.apiUrl}/projects/${projectId}`, {
        responseType: 'text',
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
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
          return throwError(() => err);
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
          // res: Project; // TODO:
          this.project.set({ ...project, status: ProjectStatus.COMPLETED });
          // this.project.set(res)
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public addToProject(projectId: string, user: User): Observable<string> {
    return this.http
      .patch(`${environment.apiUrl}/projects/${projectId}/user/add`, user, {
        responseType: 'text',
      })
      .pipe(
        tap(() => {
          this.allowAddToProject = false;
        }),
        catchError((err: HttpErrorResponse) => {
          this.allowAddToProject = false;

          return throwError(() => err);
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
          return throwError(() => err);
        })
      );
  }

  public allowAccessToAddToProject(): void {
    this.allowAddToProject = true;
  }

  public setProject(project: Project): void {
    this.project.set(project);
  }
}
