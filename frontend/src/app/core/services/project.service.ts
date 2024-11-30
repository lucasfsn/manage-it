import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Project,
  ProjectData,
  ProjectStatus,
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

  loadedProjects = this.projects.asReadonly();
  loadedProject = this.project.asReadonly();

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

  createProject(project: ProjectData) {
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

  getProject(projectId: string) {
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

  deleteProject(projectId: string) {
    return this.http
      .delete<string>(`${environment.apiUrl}/projects/${projectId}`)
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

  updateProject(projectId: string, updatedProject: ProjectData) {
    const prevProject = this.project();

    if (!prevProject)
      return throwError(
        () => new Error('Something went wrong. Project not found')
      );

    this.project.set({ ...prevProject, ...updatedProject });

    return this.http
      .patch<Project>(
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
      .patch<Project>(
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
      .patch<Project>(
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

  setProject(project: Project) {
    this.project.set(project);
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
