import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Project, ProjectStatus } from '../../../../features/dto/project.model';
import { ProjectService } from '../../../../features/services/project.service';
import { projectStatusMapper } from '../../../../shared/utils/status-mapper';

@Component({
  selector: 'app-projects-summary',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './projects-summary.component.html',
  styleUrl: './projects-summary.component.css',
})
export class ProjectsSummaryComponent implements OnInit {
  constructor(private projectService: ProjectService) {}

  protected activeProjectsCount = 0;
  protected progressChartData: ChartData<'doughnut'> = {
    labels: [
      projectStatusMapper(ProjectStatus.COMPLETED),
      projectStatusMapper(ProjectStatus.IN_PROGRESS),
    ],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#0ea5e9', '#fb923c'],
        borderColor: '#e5e7eb',
      },
    ],
  };
  protected progressChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
      },
    },
  };

  protected get projects(): Project[] {
    return this.projectService.loadedProjects() || [];
  }

  protected updateChart(): void {
    const projects = this.projectService.loadedProjects();

    if (!projects) return;

    const inProgress = projects.filter(
      (p) => p.status === ProjectStatus.IN_PROGRESS
    ).length;
    const completed = projects.filter(
      (p) => p.status === ProjectStatus.COMPLETED
    ).length;

    this.activeProjectsCount = inProgress;

    this.progressChartData.datasets[0].data = [completed, inProgress];
  }

  public ngOnInit(): void {
    this.updateChart();
  }
}
