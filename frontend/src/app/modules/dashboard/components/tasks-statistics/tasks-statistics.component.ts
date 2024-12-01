import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TaskStatus } from '../../../../features/dto/project.model';
import { ProjectService } from '../../../../features/services/project.service';
import { taskStatusMapper } from '../../../../shared/utils/status-mapper';

@Component({
  selector: 'app-tasks-statistics',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './tasks-statistics.component.html',
  styleUrl: './tasks-statistics.component.css',
})
export class TasksStatisticsComponent implements OnInit {
  constructor(private projectService: ProjectService) {}

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  updateChartData(): void {
    const projects = this.projectService.loadedProjects();

    if (!projects) return;

    const taskStatusCounts: { [key in TaskStatus]: number } = {
      [TaskStatus.NotStarted]: 0,
      [TaskStatus.InProgress]: 0,
      [TaskStatus.Completed]: 0,
    };

    projects.forEach((project) => {
      project.tasks.forEach((task) => {
        taskStatusCounts[task.status]++;
      });
    });

    this.barChartData = {
      labels: Object.keys(taskStatusCounts).map((status) =>
        taskStatusMapper(status as TaskStatus)
      ),
      datasets: [
        {
          data: Object.values(taskStatusCounts),
          backgroundColor: [
            'rgba(244, 63, 94, 0.6)',
            'rgba(249, 115, 22, 0.6)',
            'rgba(14, 165, 233, 0.6)',
          ],
          borderColor: [
            'rgba(244, 63, 94, 1)',
            'rgba(249, 115, 22, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  ngOnInit(): void {
    this.updateChartData();
  }
}
