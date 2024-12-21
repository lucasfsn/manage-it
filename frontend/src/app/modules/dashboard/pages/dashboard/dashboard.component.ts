import { Component } from '@angular/core';
import { OngoingProjectsComponent } from '../../components/ongoing-projects/ongoing-projects.component';
import { ProjectsSummaryComponent } from '../../components/projects-summary/projects-summary.component';
import { TasksSummaryComponent } from '../../components/tasks-summary/tasks-summary.component';
import { UpcomingDeadlinesComponent } from '../../components/upcoming-deadlines/upcoming-deadlines.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    UpcomingDeadlinesComponent,
    OngoingProjectsComponent,
    ProjectsSummaryComponent,
    TasksSummaryComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
