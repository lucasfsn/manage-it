import { Component, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ProjectsListComponent } from '../../components/projects-list/projects-list.component';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [ProjectsListComponent, SpinnerComponent],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.css',
})
export class ProjectsPageComponent {
  projects = signal<Project[] | undefined>(undefined);
  isLoading = signal<boolean>(false);

  constructor(
    private projectService: ProjectService,
    private loadingService: LoadingService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading.set(loading);
    });

    this.loadProjects();
  }

  loadProjects(): void {
    this.loadingService.loadingOn();
    this.projectService.getProjects('123').subscribe({
      next: (projects) => {
        this.projects.set(projects);
      },
      error: (error: Error) => {
        this.toastrService.error(error.message);
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }
}
