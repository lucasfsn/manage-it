import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Project, ProjectStatus } from '../../../../core/models/project.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ProjectService } from '../../../../core/services/project.service';
import { projectStatusMapper } from '../../../../shared/utils/status-mapper';

@Component({
  selector: 'app-active-projects-summary',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './active-projects-summary.component.html',
  styleUrl: './active-projects-summary.component.css',
})
export class ActiveProjectsSummaryComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private projectService: ProjectService
  ) {}

  get projects(): Project[] | undefined {
    return this.projectService.loadedProjects();
  }

  public activeProjectsCount = 0;

  progressChartData: ChartData<'doughnut'> = {
    labels: [
      projectStatusMapper(ProjectStatus.Completed),
      projectStatusMapper(ProjectStatus.InProgress),
    ],
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
        (p) => p.status === ProjectStatus.InProgress
      ).length;
      const completed = this.projects.filter(
        (p) => p.status === ProjectStatus.Completed
      ).length;

      this.activeProjectsCount = inProgress;

      this.progressChartData.datasets[0].data = [completed, inProgress];
    }
  }

  isInProject(project: Project): boolean {
    return project.members.some(
      (member) => member.username === this.authService.getLoggedInUsername()
    );
  }

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(): void {
    this.updateChart();
  }
}
