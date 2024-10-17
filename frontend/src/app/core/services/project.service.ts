import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { dummyProjects } from '../../dummy-data';
import { Project, ProjectCreate, Status } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private toastr = inject(ToastrService);
  private httpClient = inject(HttpClient);

  private projects = signal<Project[]>(dummyProjects);
  private project = signal<Project | null>(null);

  loadedProjects = this.projects.asReadonly();
  loadedProject = this.project.asReadonly();

  getProjects(userId: string) {
    return of(this.projects()).pipe(
      tap({
        next: (projects) => {
          this.projects.set(projects);
        },
        error: (error) => {
          console.error(
            "Couldn't fetch projects. Please try again later.",
            error
          );
        },
      })
    );
  }

  getProject(projectId: string) {
    const project = this.projects().find((p) => p.id === projectId);

    return of(project).pipe(
      tap({
        next: (project) => {
          if (project) {
            this.project.set(project);
          } else {
            throw new Error('Project not found');
          }
        },
        error: (error) => {
          throw new Error("Couldn't fetch project. Please try again later.");
        },
      })
    );
  }

  addProject(project: ProjectCreate) {
    const prevProjects = this.projects();

    const newProject: Project = {
      ...project,
      id: Math.random().toString(16).slice(2),
      completedTasks: 0,
      totalTasks: 0,
      status: Status.InProgress,
      owner: {
        firstName: 'John',
        lastName: 'Doe',
        userName: 'john_doe',
      },
      members: [
        {
          firstName: 'John',
          lastName: 'Doe',
          userName: 'john_doe',
        },
      ],
    };

    this.projects.set([...prevProjects, newProject]);

    return of(newProject).pipe(
      tap(() => {
        this.toastr.success('Project created successfully');
      }),
      catchError((err) => {
        this.projects.set(prevProjects);
        this.toastr.error("Couldn't create project. Please try again later.");
        return throwError(
          () => new Error("Couldn't create project. Please try again later.")
        );
      })
    );
  }

  deleteProject(projectId: string) {
    const prevProjects = this.projects();
    const updatedProjects = prevProjects.filter(
      (project) => project.id !== projectId
    );

    this.projects.set(updatedProjects);

    return of(null).pipe(
      tap(() => {
        this.toastr.success('Project deleted successfully');
      }),
      catchError((err) => {
        this.projects.set(prevProjects);
        this.toastr.error("Couldn't delete project. Please try again later.");
        return throwError(
          () => new Error("Couldn't delete project. Please try again later.")
        );
      })
    );
  }

  private fetchProjects(url: string, errorMessage: string) {
    return this.httpClient.get<{ projects: Project[] }>(url).pipe(
      map((res) => res.projects),
      catchError((err) => {
        console.log(err);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
