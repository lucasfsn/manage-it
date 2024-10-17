import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { delay, Observable, of } from 'rxjs';
import { dummyProjects } from '../../dummy-data';
import { Project, ProjectCreate, Status } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projects: Project[] = dummyProjects;
  private toastr = inject(ToastrService);

  getProjects(userId: string): Observable<Project[]> {
    return of(this.projects).pipe(delay(300));
  }
  addProject(project: ProjectCreate): Observable<Project> {
    const id = Math.random().toString(16).slice(2);
    const newProject: Project = {
      ...project,
      id,
      completedTasks: 0,
      totalTasks: 0,
      status: Status.InProgress,
      owner: '123',
      members: [],
    };
    this.projects.push(newProject);

    this.toastr.success('Project created successfully');

    return of(newProject).pipe(delay(300));
  }
}
