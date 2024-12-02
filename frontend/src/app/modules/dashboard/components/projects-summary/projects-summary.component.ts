import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ProjectStatus } from '../../../../features/dto/project.model';
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

  activeProjectsCount = 0;

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
    const projects = this.projectService.loadedProjects();

    if (!projects) return;

    const inProgress = projects.filter(
      (p) => p.status === ProjectStatus.InProgress
    ).length;
    const completed = projects.filter(
      (p) => p.status === ProjectStatus.Completed
    ).length;

    this.activeProjectsCount = inProgress;

    this.progressChartData.datasets[0].data = [completed, inProgress];
  }

  ngOnInit(): void {
    this.updateChart();
  }
}
