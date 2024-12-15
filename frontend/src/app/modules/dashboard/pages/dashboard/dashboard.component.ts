import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../features/services/auth.service';
import { LoadingService } from '../../../../features/services/loading.service';
import { ProjectService } from '../../../../features/services/project.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { OngoingProjectsComponent } from '../../components/ongoing-projects/ongoing-projects.component';
import { ProjectsSummaryComponent } from '../../components/projects-summary/projects-summary.component';
import { TasksSummaryComponent } from '../../components/tasks-summary/tasks-summary.component';
import { UpcomingDeadlinesComponent } from '../../components/upcoming-deadlines/upcoming-deadlines.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SpinnerComponent,
    UpcomingDeadlinesComponent,
    OngoingProjectsComponent,
    ProjectsSummaryComponent,
    TasksSummaryComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  protected get isLoading(): boolean {
    return this.loadingService.isLoading();
  }
  private loadProjects(): void {
    const username = this.authService.getLoggedInUsername();

    if (!username) return;

    this.loadingService.loadingOn();
    this.projectService.getProjects().subscribe({
      error: (error: Error) => {
        this.toastrService.error(error.message);
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  public ngOnInit(): void {
    this.loadProjects();
  }
}
