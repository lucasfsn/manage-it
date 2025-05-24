import {
  Project,
  ProjectRequest,
  ProjectStatus,
  User,
} from '@/app/features/dto/project.model';
import { Response } from '@/app/shared/dto/response.model';
import { environment } from '@/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private allowAddToProject: boolean = false;

  private projects = signal<Project[]>([]);
  public loadedProjects = this.projects.asReadonly();

  private project = signal<Project | null>(null);
  public loadedProject = this.project.asReadonly();

  public constructor(private http: HttpClient) {}

  public get accessAddToProject(): boolean {
    return this.allowAddToProject;
  }

  public getProjects(): Observable<Project[]> {
    return this.http
      .get<Response<Project[]>>(`${environment.apiUrl}/projects`)
      .pipe(
        tap((res: Response<Project[]>) => this.projects.set(res.data)),
        map((res: Response<Project[]>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public createProject(newProject: ProjectRequest): Observable<Project> {
    return this.http
      .post<Response<Project>>(`${environment.apiUrl}/projects`, newProject)
      .pipe(
        tap((res: Response<Project>) =>
          this.projects.update((projects) => [...projects, res.data]),
        ),
        map((res: Response<Project>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public getProject(projectId: string): Observable<Project> {
    return this.http
      .get<Response<Project>>(`${environment.apiUrl}/projects/${projectId}`)
      .pipe(
        tap((res: Response<Project>) => this.project.set(res.data)),
        map((res: Response<Project>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public deleteProject(projectId: string): Observable<null> {
    return this.http
      .delete<Response<null>>(`${environment.apiUrl}/projects/${projectId}`)
      .pipe(
        map((res: Response<null>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public updateProject(
    projectId: string,
    updatedProject: ProjectRequest,
  ): Observable<Project> {
    return this.http
      .patch<
        Response<Project>
      >(`${environment.apiUrl}/projects/${projectId}`, updatedProject)
      .pipe(
        tap((res: Response<Project>) => this.project.set(res.data)),
        map((res: Response<Project>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public completeProject(project: Project): Observable<Project> {
    return this.http
      .patch<Response<Project>>(
        `${environment.apiUrl}/projects/${project.id}`,
        {
          status: ProjectStatus.COMPLETED,
        },
      )
      .pipe(
        tap((res: Response<Project>) => this.project.set(res.data)),
        map((res: Response<Project>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public addToProject(projectId: string, user: User): Observable<null> {
    return this.http
      .patch<
        Response<null>
      >(`${environment.apiUrl}/projects/${projectId}/user/add`, user)
      .pipe(
        tap(() => (this.allowAddToProject = false)),
        map((res: Response<null>) => res.data),
        catchError((err: HttpErrorResponse) => {
          this.allowAddToProject = false;

          return throwError(() => err);
        }),
      );
  }

  public removeFromProject(user: User, projectId: string): Observable<Project> {
    return this.http
      .patch<
        Response<Project>
      >(`${environment.apiUrl}/projects/${projectId}/user/remove`, user)
      .pipe(
        tap((res: Response<Project>) => this.project.set(res.data)),
        map((res: Response<Project>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public allowAccessToAddToProject(): void {
    this.allowAddToProject = true;
  }

  public setProject(project: Project): void {
    this.project.set(project);
  }
}
