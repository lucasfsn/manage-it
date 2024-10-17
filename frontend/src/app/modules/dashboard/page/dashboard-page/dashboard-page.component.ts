import { Component, OnInit, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ActiveProjectsSummaryComponent } from '../../components/active-projects-summary/active-projects-summary.component';
import { ProjectStatisticsComponent } from '../../components/project-statistics/project-statistics.component';
import { UpcomingDeadlinesComponent } from '../../components/upcoming-deadlines/upcoming-deadlines.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    ProjectStatisticsComponent,
    SpinnerComponent,
    UpcomingDeadlinesComponent,
    ActiveProjectsSummaryComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent implements OnInit {
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

  sortProjectsByEndDate(): Project[] {
    const projects = this.projects();

    return projects
      ? projects
          .slice()
          .sort(
            (a, b) =>
              new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
          )
      : [];
  }
}
