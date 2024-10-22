import { Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project, Status, Task } from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ProjectInformationComponent } from '../../components/project-information/project-information.component';
import { TasksComponent } from '../../components/tasks/tasks.component';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    SpinnerComponent,
    MatIconModule,
    RouterLink,
    TasksComponent,
    ProjectInformationComponent,
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.css',
})
export class ProjectPageComponent implements OnInit {
  readonly Status = Status;
  public isLoading = signal<boolean>(false);
  public project = signal<Project | undefined>(undefined);

  constructor(
    private projectService: ProjectService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  handleDelete() {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      this.toastrService.error('Project ID is missing');
      return;
    }

    const confirmDelete = confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmDelete) {
      return;
    }

    this.projectService.deleteProject(projectId).subscribe({
      next: () => {
        this.router.navigate(['/projects']);
      },
      error: (error: Error) => {
        this.toastrService.error(error.message);
      },
    });
  }

  handleComplete() {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      this.toastrService.error('Project ID is missing');
      return;
    }

    const confirmComplete = confirm(
      'Are you sure you want to mark this project as completed?'
    );

    if (!confirmComplete) {
      return;
    }

    this.projectService.completeProject(projectId).subscribe({
      next: () => {
        this.router.navigate(['/projects']);
      },
      error: (error: Error) => {
        this.toastrService.error(error.message);
      },
    });
  }

  handleUpdate(task: Task) {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      this.toastrService.error('Project ID is missing');
      return;
    }

    this.projectService.updateTask(projectId, task).subscribe();
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      this.toastrService.error('Project ID is missing');
      this.router.navigate(['/projects']);
      return;
    }

    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading.set(loading);
    });

    this.loadingService.loadingOn();
    this.projectService.getProject(projectId).subscribe({
      next: (project) => {
        this.project.set(project);
      },
      error: (error: Error) => {
        this.toastrService.error(error.message);
        this.loadingService.loadingOff();
        this.router.navigate(['/projects']);
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }
}
