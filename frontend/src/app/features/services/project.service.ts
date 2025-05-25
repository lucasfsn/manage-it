import { ProjectDto, ProjectPayload } from '@/app/features/dto/project.model';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { UserSummaryDto } from '@/app/shared/dto/user-summary.model';
import { Response } from '@/app/shared/types/response.type';
import { handleApiError } from '@/app/shared/utils/handle-api-error.util';
import { environment } from '@/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private allowAddToProject: boolean = false;

  private projects = signal<ProjectDto[]>([]);
  public loadedProjects = this.projects.asReadonly();

  private project = signal<ProjectDto | null>(null);
  public loadedProject = this.project.asReadonly();

  public constructor(private http: HttpClient) {}

  public get accessAddToProject(): boolean {
    return this.allowAddToProject;
  }

  public getProjects(): Observable<ProjectDto[]> {
    return this.http
      .get<Response<ProjectDto[]>>(`${environment.apiUrl}/projects`)
      .pipe(
        tap((res: Response<ProjectDto[]>) => this.projects.set(res.data)),
        map((res: Response<ProjectDto[]>) => res.data),
        catchError(handleApiError),
      );
  }

  public createProject(newProject: ProjectPayload): Observable<ProjectDto> {
    return this.http
      .post<Response<ProjectDto>>(`${environment.apiUrl}/projects`, newProject)
      .pipe(
        tap((res: Response<ProjectDto>) =>
          this.projects.update((projects) => [...projects, res.data]),
        ),
        map((res: Response<ProjectDto>) => res.data),
        catchError(handleApiError),
      );
  }

  public getProject(projectId: string): Observable<ProjectDto> {
    return this.http
      .get<Response<ProjectDto>>(`${environment.apiUrl}/projects/${projectId}`)
      .pipe(
        tap((res: Response<ProjectDto>) => this.project.set(res.data)),
        map((res: Response<ProjectDto>) => res.data),
        catchError(handleApiError),
      );
  }

  public deleteProject(projectId: string): Observable<null> {
    return this.http
      .delete<Response<null>>(`${environment.apiUrl}/projects/${projectId}`)
      .pipe(
        map((res: Response<null>) => res.data),
        catchError(handleApiError),
      );
  }

  public updateProject(
    projectId: string,
    updatedProject: ProjectPayload,
  ): Observable<ProjectDto> {
    return this.http
      .patch<
        Response<ProjectDto>
      >(`${environment.apiUrl}/projects/${projectId}`, updatedProject)
      .pipe(
        tap((res: Response<ProjectDto>) => this.project.set(res.data)),
        map((res: Response<ProjectDto>) => res.data),
        catchError(handleApiError),
      );
  }

  public completeProject(project: ProjectDto): Observable<ProjectDto> {
    return this.http
      .patch<Response<ProjectDto>>(
        `${environment.apiUrl}/projects/${project.id}`,
        {
          status: ProjectStatus.COMPLETED,
        },
      )
      .pipe(
        tap((res: Response<ProjectDto>) => this.project.set(res.data)),
        map((res: Response<ProjectDto>) => res.data),
        catchError(handleApiError),
      );
  }

  public addToProject(
    projectId: string,
    user: UserSummaryDto,
  ): Observable<null> {
    return this.http
      .patch<
        Response<null>
      >(`${environment.apiUrl}/projects/${projectId}/user/add`, user)
      .pipe(
        tap(() => (this.allowAddToProject = false)),
        map((res: Response<null>) => res.data),
        catchError((err: HttpErrorResponse) => {
          this.allowAddToProject = false;

          return handleApiError(err);
        }),
      );
  }

  public removeFromProject(
    user: UserSummaryDto,
    projectId: string,
  ): Observable<ProjectDto> {
    return this.http
      .patch<
        Response<ProjectDto>
      >(`${environment.apiUrl}/projects/${projectId}/user/remove`, user)
      .pipe(
        tap((res: Response<ProjectDto>) => this.project.set(res.data)),
        map((res: Response<ProjectDto>) => res.data),
        catchError(handleApiError),
      );
  }

  public allowAccessToAddToProject(): void {
    this.allowAddToProject = true;
  }

  public setProject(project: ProjectDto): void {
    this.project.set(project);
  }
}
