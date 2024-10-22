import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Project, Status } from '../../../../core/models/project.model';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-active-projects-summary',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './active-projects-summary.component.html',
  styleUrl: './active-projects-summary.component.css',
})
export class ActiveProjectsSummaryComponent implements OnInit {
  @Input() projects: Project[] | undefined;

  constructor(private userService: UserService) {}

  public activeProjectsCount = 0;

  progressChartData: ChartData<'doughnut'> = {
    labels: [Status.Completed, Status.InProgress],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#0ea5e9', '#fb923c'],
        borderColor: '#e5e7eb',
      },
    ],
  };
  progressChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
      },
    },
  };

  updateChart() {
    if (this.projects) {
      const inProgress = this.projects.filter(
        (p) => p.status === 'In Progress'
      ).length;
      const completed = this.projects.filter(
        (p) => p.status === 'Completed'
      ).length;

      this.activeProjectsCount = inProgress;

      this.progressChartData.datasets[0].data = [completed, inProgress];
    }
  }

  isInProject(project: Project): boolean {
    return project.members.some(
      (member) =>
        member.userName === this.userService.getLoggedInUser()?.userName
    );
  }

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(): void {
    this.updateChart();
  }
}
