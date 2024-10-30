import { Injectable, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { delay, of, tap } from 'rxjs';
import { dummyProjects } from '../../dummy-data';
import {
  Project,
  ProjectCreate,
  Status,
  Task,
  TaskCreate,
  User,
} from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private toastrService: ToastrService) {}

  private allowAccess = false;

  private projects = signal<Project[] | undefined>(undefined);
  private project = signal<Project | undefined>(undefined);
  private task = signal<Task | undefined>(undefined);

  loadedProjects = this.projects.asReadonly();
  loadedProject = this.project.asReadonly();
  loadedTask = this.task.asReadonly();

  getProjects(username: string) {
    const userProjects = dummyProjects.filter((project) =>
      project.members.some((member) => member.userName === username)
    );

    return of(userProjects).pipe(
      delay(300),
      tap({
        next: (projects) => {
          this.projects.set(projects);
        },
        error: (error) => {
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  getProject(projectId: string) {
    const foundProject = dummyProjects.find((p) => p.id === projectId);

    return of(foundProject).pipe(
      delay(300),
      tap({
        next: (project) => {
          this.project.set(project);
        },
        error: (error) => {
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  addProject(project: ProjectCreate) {
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

    dummyProjects.push(newProject);

    const prevProjects = this.projects() || [];
    this.projects.set([...prevProjects, newProject]);

    return of(newProject).pipe(
      delay(3000),
      tap({
        next: () => {
          this.toastrService.success('Project created successfully');
        },
        error: (error) => {
          this.projects.set(prevProjects);
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  deleteProject(projectId: string) {
    const prevProjects = this.projects() || [];
    const updatedProjects = prevProjects.filter(
      (project) => project.id !== projectId
    );

    const dummyIndex = dummyProjects.findIndex(
      (project) => project.id === projectId
    );
    if (dummyIndex !== -1) {
      dummyProjects.splice(dummyIndex, 1);
    }

    this.projects.set(updatedProjects);

    return of(updatedProjects).pipe(
      delay(300),
      tap({
        next: () => {
          this.toastrService.success('Project deleted successfully');
        },
        error: (error) => {
          this.projects.set(prevProjects);
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  updateProject(project: Project) {}

  getTask(projectId: string, taskId: string) {
    const foundProject = dummyProjects.find((p) => p.id === projectId);
    const foundTask = foundProject?.tasks.find((t) => t.id === taskId);

    return of(foundTask).pipe(
      delay(300),
      tap({
        next: (task) => {
          this.task.set(task);
        },
        error: (error) => {
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  addTask(task: TaskCreate) {
    const prevProjects = this.projects() || [];
    const project = prevProjects.find((p) => p.id === task.projectId);

    if (!project) throw new Error('Project not found');

    console.log(task);

    return of(task).pipe(
      delay(300),
      tap({
        next: (task) => {
          const fakeId = Math.random().toString(16).slice(2);
          project.tasks.push({ ...task, id: fakeId, users: [] });
          this.projects.set([...prevProjects]);
        },
        error: (error) => {
          this.projects.set([...prevProjects]);
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  moveTask(projectId: string, task: Task) {
    const prevProjects = this.projects() || [];
    const project = prevProjects.find((p) => p.id === projectId);

    if (!project) throw new Error('Project not found');

    const taskIndex = project.tasks.findIndex((t) => t.id === task.id);

    if (taskIndex === -1) throw new Error('Task not found');

    const updatedProjectTasksList = project.tasks.map((t) =>
      t.id === task.id ? { ...t, status: task.status } : t
    );

    return of(updatedProjectTasksList).pipe(
      delay(300),
      tap({
        error: (error) => {
          this.projects.set(prevProjects);
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  completeProject(projectId: string) {
    const prevProjects = this.projects() || [];
    const project = prevProjects.find((p) => p.id === projectId);

    if (!project) throw new Error('Project not found');

    const updatedProjects = prevProjects.map((p) =>
      p.id === projectId ? { ...p, status: Status.Completed } : p
    );

    project.status = Status.Completed;
    this.projects.set(updatedProjects);

    return of(project).pipe(
      delay(300),
      // mergeMap(() => {
      //   return throwError(() => new Error('Failed to update user data.'));
      // }),
      tap({
        error: (error) => {
          project.status = Status.InProgress;
          this.projects.set(prevProjects);
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  addToProject(projectId: string, user: User, currentUser: string) {
    const project = dummyProjects.find((p) => p.id === projectId);

    if (!project) throw new Error('Project not found');

    if (project.owner.userName !== currentUser)
      throw new Error('Only the project owner can add members to the project');

    return of(project).pipe(
      delay(300),
      // mergeMap(() => {
      //   return throwError(() => new Error('Failed to update user data.'));
      // }),
      tap({
        next: () => {
          project.members.push(user);
          this.toastrService.success(
            `${user.firstName} ${user.lastName} has been added to project`
          );
          this.allowAccessToAddToProject = false;
        },
        error: (error) => {
          this.allowAccessToAddToProject = false;
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
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

  hasAccessToProject(userName: string, projectId: string): boolean {
    const projects = this.projects();
    const project = projects?.find((p) => p.id === projectId);

    if (!project) return false;

    return project.members.some((member) => member.userName === userName);
  }
}
