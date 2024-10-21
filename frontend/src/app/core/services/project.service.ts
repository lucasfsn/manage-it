import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { dummyProjects } from '../../dummy-data';
import {
  Priority,
  Project,
  ProjectCreate,
  Status,
  Task,
  TaskStatus,
} from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(
    private toastrService: ToastrService,
    private httpClient: HttpClient
  ) {}

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
      tasks: [],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    };

    this.projects.set([...prevProjects, newProject]);

    return of(newProject).pipe(
      tap(() => {
        this.toastrService.success('Project created successfully');
      }),
      catchError((err) => {
        this.projects.set(prevProjects);
        this.toastrService.error(
          "Couldn't create project. Please try again later."
        );
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
        this.toastrService.success('Project deleted successfully');
      }),
      catchError((err) => {
        this.projects.set(prevProjects);
        this.toastrService.error(
          "Couldn't delete project. Please try again later."
        );
        return throwError(
          () => new Error("Couldn't delete project. Please try again later.")
        );
      })
    );
  }

  updateTask(projectId: string, task: Task): Observable<Task> {
    const prevProjects = this.projects();
    const project = prevProjects.find((p) => p.id === projectId);

    if (!project) {
      return throwError(() => new Error('Project not found'));
    }

    const taskIndex = project.tasks.findIndex((t) => t.id === task.id);
    if (taskIndex === -1) {
      return throwError(() => new Error('Task not found'));
    }

    project.tasks[taskIndex] = task;
    this.projects.set([...prevProjects]);

    return of(task).pipe(
      catchError((err) => {
        this.projects.set(prevProjects);
        this.toastrService.error(
          "Couldn't update task. Please try again later."
        );
        return throwError(
          () => new Error("Couldn't update task. Please try again later.")
        );
      })
    );
  }

  completeProject(projectId: string): Observable<Project> {
    const prevProjects = this.projects();
    const project = prevProjects.find((p) => p.id === projectId);

    if (!project) {
      return throwError(() => new Error('Project not found'));
    }

    project.status = Status.Completed;
    this.projects.set([...prevProjects]);

    return of(project).pipe(
      tap(() => {
        this.toastrService.success('Project marked as completed');
      }),
      catchError((err) => {
        this.projects.set(prevProjects);
        this.toastrService.error(
          "Couldn't complete project. Please try again later."
        );
        return throwError(
          () => new Error("Couldn't complete project. Please try again later.")
        );
      })
    );
  }

  hasAccessToProject(userName: string, projectId: string): boolean {
    const project = this.projects().find((p) => p.id === projectId);

    if (!project) {
      return false;
    }

    return project.members.some((member) => member.userName === userName);
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
