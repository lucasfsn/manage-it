import { Injectable, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { delay, Observable, of, tap } from 'rxjs';
import { dummyProjects } from '../../dummy-data';
import {
  Project,
  ProjectCreate,
  Status,
  Task,
  TaskCreate,
  UpdateProject,
  UpdateTask,
  User,
} from '../models/project.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(
    private toastrService: ToastrService,
    private authService: AuthService
  ) {}

  private allowAccess = false;

  private projects = signal<Project[] | undefined>(undefined);
  private project = signal<Project | undefined>(undefined);
  private task = signal<Task | undefined>(undefined);

  loadedProjects = this.projects.asReadonly();
  loadedProject = this.project.asReadonly();
  loadedTask = this.task.asReadonly();

  getProjects(username: string): Observable<Project[]> {
    const userProjects = dummyProjects.filter((project) =>
      project.members.some((member) => member.username === username)
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

  getProject(projectId: string): Observable<Project | undefined> {
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

  getProjectMembers(projectId: string): Observable<User[]> {
    const project = dummyProjects.find((p) => p.id === projectId);

    if (!project) {
      this.toastrService.error('Something went wrong.');
      return of([]);
    }

    return of(project.members).pipe(
      delay(3000),
      tap({
        error: (error) => {
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  addProject(project: ProjectCreate): Observable<Project> {
    const newProject: Project = {
      ...project,
      id: Math.random().toString(16).slice(2),
      completedTasks: 0,
      totalTasks: 0,
      status: Status.InProgress,
      owner: {
        firstName: 'John',
        lastName: 'Doe',
        username: 'john_doe',
      },
      members: [
        {
          firstName: 'John',
          lastName: 'Doe',
          username: 'john_doe',
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

  deleteProject(projectId: string): Observable<Project[]> {
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

  updateProject(
    updatedProject: UpdateProject
  ): Observable<UpdateProject | null> {
    const prevProjects = this.projects() || [];
    const project = prevProjects.find((p) => p.id === updatedProject.id);
    const user = this.authService.loadedUser();

    if (!project || !user) {
      this.toastrService.error('Something went wrong.');
      return of(null);
    }

    this.project.set({ ...project, ...updatedProject });

    const updatedProjects = prevProjects.map((p) =>
      p.id === updatedProject.id ? { ...p, ...updatedProject } : p
    );

    this.projects.set(updatedProjects);

    return of(updatedProject).pipe(
      delay(300),
      tap({
        next: () => {
          this.toastrService.success('Project updated successfully');
        },
        error: (error) => {
          this.projects.set(prevProjects);
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  getTask(projectId: string, taskId: string): Observable<Task | undefined> {
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

  addTask(task: TaskCreate): Observable<TaskCreate | null> {
    const prevProjects = this.projects() || [];
    const project = prevProjects.find((p) => p.id === task.projectId);
    const user = this.authService.loadedUser();

    if (!project || !user) {
      this.toastrService.error('Something went wrong.');
      return of(null);
    }

    const taskUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    };

    return of(task).pipe(
      delay(300),
      tap({
        next: (task: TaskCreate) => {
          const fakeId = Math.random().toString(16).slice(2);
          project.tasks.push({ ...task, id: fakeId, users: [taskUser] });
          this.projects.set([...prevProjects]);
          this.toastrService.success('Task added successfully.');
        },
        error: (error) => {
          this.projects.set([...prevProjects]);
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  moveTask(projectId: string, task: Task): Observable<Task[] | null> {
    const prevProjects = this.projects() || [];
    const project = prevProjects.find((p) => p.id === projectId);
    const prevProject = this.project();
    const user = this.authService.loadedUser();

    if (!project || !user) {
      this.toastrService.error('Something went wrong.');
      return of(null);
    }

    const taskIndex = this.project()?.tasks.findIndex((t) => t.id === task.id);

    if (taskIndex === -1) {
      this.toastrService.error('Task not found.');
      return of(null);
    }

    const updatedProjectTasksList = project.tasks.map((t) =>
      t.id === task.id ? { ...t, status: task.status } : t
    );

    const updatedProject = { ...project, tasks: updatedProjectTasksList };
    const updatedProjects = prevProjects.map((p) =>
      p.id === projectId ? updatedProject : p
    );

    this.projects.set(updatedProjects);
    this.project.set(updatedProject);

    return of(updatedProjectTasksList).pipe(
      delay(300),
      tap({
        error: (error) => {
          this.projects.set(prevProjects);
          this.project.set(prevProject);
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  updateTask(updatedTask: UpdateTask): Observable<Task | null> {
    const prevTask = this.task();
    const user = this.authService.loadedUser();

    if (!user || !prevTask) {
      this.toastrService.error('Something went wrong.');
      return of(null);
    }

    const updatedTaskData = {
      ...prevTask,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: updatedTask.dueDate,
    };

    this.task.set(updatedTaskData);

    return of(updatedTaskData).pipe(
      delay(300),
      tap({
        error: (error) => {
          this.task.set(prevTask);
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  completeProject(projectId: string): Observable<Project | null> {
    const prevProjects = this.projects() || [];
    const project = prevProjects.find((p) => p.id === projectId);
    const user = this.authService.loadedUser();

    if (!project || !user) {
      this.toastrService.error('Something went wrong.');
      return of(null);
    }

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

  addToProject(
    projectId: string,
    user: User,
    currentUser: string
  ): Observable<Project | null> {
    const project = dummyProjects.find((p) => p.id === projectId);

    if (!project) {
      this.toastrService.error('Something went wrong.');
      return of(null);
    }

    if (project.owner.username !== currentUser) {
      this.toastrService.error(
        'Only the project owner can add members to the project.'
      );
      return of(null);
    }

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

  addToTask(
    projectId: string,
    taskId: string,
    user: User
  ): Observable<Task | null> {
    const prevTask = this.task();
    const loggedInUser = this.authService.loadedUser();

    if (!projectId || !user || !loggedInUser || !taskId) {
      this.toastrService.error('Something went wrong.');
      return of(null);
    }

    const project = dummyProjects.find((p) => p.id === projectId);

    const updatedTask = project?.tasks.map((t) =>
      t.id === taskId ? { ...t, users: [...t.users, user] } : t
    );

    const updatedTaskItem = updatedTask?.find((t) => t.id === taskId);
    if (updatedTaskItem) this.task.set(updatedTaskItem);

    return of(updatedTaskItem ?? null).pipe(
      delay(300),
      tap({
        next: () => {
          this.toastrService.success(
            `${user.firstName} ${user.lastName} has been added to task`
          );
        },
        error: (error) => {
          this.task.set(prevTask);
          this.toastrService.error('Something went wrong.');
          console.error(error);
        },
      })
    );
  }

  removeFromTask(projectId: string, taskId: string, user: User) {
    const prevTask = this.task();
    const loggedInUser = this.authService.loadedUser();

    if (!projectId || !user || !loggedInUser || !taskId) {
      this.toastrService.error('Something went wrong.');
      return of(null);
    }

    const project = dummyProjects.find((p) => p.id === projectId);

    const updatedTask = project?.tasks.map((t) =>
      t.id === taskId
        ? { ...t, users: t.users.filter((u) => u.username !== user.username) }
        : t
    );

    const updatedTaskItem = updatedTask?.find((t) => t.id === taskId);
    if (updatedTaskItem) this.task.set(updatedTaskItem);

    return of(updatedTaskItem ?? null).pipe(
      delay(300),
      tap({
        next: () => {
          this.toastrService.success(
            `${user.firstName} ${user.lastName} has been removed from task`
          );
        },
        error: (error) => {
          this.task.set(prevTask);
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

  hasAccessToProject(username: string, projectId: string): boolean {
    const projects = this.projects();
    const project = projects?.find((p) => p.id === projectId);

    if (!project) return false;

    return project.members.some((member) => member.username === username);
  }
}
