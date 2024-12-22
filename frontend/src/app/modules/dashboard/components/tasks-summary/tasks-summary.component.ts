import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TaskStatus } from '../../../../features/dto/project.model';
import { MapperService } from '../../../../features/services/mapper.service';
import { ProjectService } from '../../../../features/services/project.service';

@Component({
  selector: 'app-tasks-summary',
  standalone: true,
  imports: [BaseChartDirective, TranslateModule],
  templateUrl: './tasks-summary.component.html',
  styleUrl: './tasks-summary.component.scss',
})
export class TasksSummaryComponent implements OnInit {
  public constructor(
    private projectService: ProjectService,
    private mapperService: MapperService
  ) {}

  protected barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  protected barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  protected updateChartData(): void {
    const projects = this.projectService.loadedProjects();

    if (!projects) return;

    const taskStatusCounts: Record<TaskStatus, number> = {
      [TaskStatus.NOT_STARTED]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.COMPLETED]: 0,
    };

    projects.forEach((project) => {
      project.tasks.forEach((task) => {
        taskStatusCounts[task.status]++;
      });
    });

    this.barChartData = {
      labels: Object.keys(taskStatusCounts).map((status) =>
        this.mapperService.taskStatusMapper(status as TaskStatus)
      ),
      datasets: [
        {
          data: Object.values(taskStatusCounts),
          backgroundColor: [
            'rgba(251, 113, 133, 0.7)',
            'rgba(251, 146, 60, 0.7)',
            'rgba(14, 165, 233, 0.7)',
          ],
          borderColor: [
            'rgba(251, 113, 133, 1)',
            'rgba(251, 146, 60, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  public ngOnInit(): void {
    this.updateChartData();
  }
}
