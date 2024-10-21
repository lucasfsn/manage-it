import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { CreateNewProjectComponent } from '../../components/create-new-project/create-new-project.component';
import { ProjectsListComponent } from '../../components/projects-list/projects-list.component';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [ProjectsListComponent, SpinnerComponent, CreateNewProjectComponent],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.css',
})
export class ProjectsPageComponent implements OnInit {
  public isLoading: boolean = false;
  public projects: Signal<Project[] | []>;

  constructor(
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private projectService: ProjectService
  ) {
    this.projects = this.projectService.loadedProjects;
  }

  loadProjects(): void {
    this.loadingService.loadingOn();
    this.projectService.getProjects('123').subscribe({
      error: (error: Error) => {
        this.toastrService.error(error.message);
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });

    this.loadProjects();
  }
}
