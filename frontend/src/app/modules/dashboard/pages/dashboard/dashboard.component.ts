import { Component } from '@angular/core';
import { OngoingProjectsComponent } from '@/app/modules/dashboard/components/ongoing-projects/ongoing-projects.component';
import { ProjectsSummaryComponent } from '@/app/modules/dashboard/components/projects-summary/projects-summary.component';
import { TasksSummaryComponent } from '@/app/modules/dashboard/components/tasks-summary/tasks-summary.component';
import { UpcomingDeadlinesComponent } from '@/app/modules/dashboard/components/upcoming-deadlines/upcoming-deadlines.component';

@Component({
    selector: 'app-dashboard',
    imports: [
        UpcomingDeadlinesComponent,
        OngoingProjectsComponent,
        ProjectsSummaryComponent,
        TasksSummaryComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {}
