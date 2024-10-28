import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../../../../core/models/project.model';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ActiveProjectsSummaryComponent } from '../../components/active-projects-summary/active-projects-summary.component';
import { ProjectStatisticsComponent } from '../../components/project-statistics/project-statistics.component';
import { UpcomingDeadlinesComponent } from '../../components/upcoming-deadlines/upcoming-deadlines.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ProjectStatisticsComponent,
    SpinnerComponent,
    UpcomingDeadlinesComponent,
    ActiveProjectsSummaryComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  get projects(): Project[] | undefined {
    return this.projectService.loadedProjects();
  }

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  sortProjectsByEndDate(): Project[] {
    const projects = this.projects;

    if (!projects) return [];

    return projects
      .slice()
      .sort(
        (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      );
  }

  private loadProjects(): void {
    const username = this.authService.getLoggedInUsername();

    if (!username) return;

    this.loadingService.loadingOn();
    this.projectService.getProjects(username).subscribe({
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
    this.loadProjects();
  }
}
