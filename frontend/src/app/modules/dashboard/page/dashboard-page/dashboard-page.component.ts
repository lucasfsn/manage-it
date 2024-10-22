import { Component, OnInit, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { UserService } from '../../../../core/services/user.service';
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
  public isLoading = signal<boolean>(false);
  public projects = signal<Project[] | undefined>(undefined);

  constructor(
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  sortProjectsByEndDate(): Project[] {
    const projects = this.projects();

    if (!projects) return [];

    return projects
      .slice()
      .sort(
        (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      );
  }

  loadProjects(): void {
    const username = this.userService.getLoggedInUser()?.userName;

    if (!username) return;

    this.loadingService.loadingOn();
    this.projectService.getProjects(username).subscribe({
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

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading.set(loading);
    });

    this.loadProjects();
  }
}
