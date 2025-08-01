import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { ProjectDto } from '@/app/features/dto/project.dto';
import { ProjectService } from '@/app/features/services/project.service';
import { TaskStatus } from '@/app/modules/task/types/task-status.type';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-tasks-summary',
  imports: [BaseChartDirective, TranslateModule, CommonModule],
  templateUrl: './tasks-summary.component.html',
  styleUrl: './tasks-summary.component.scss',
})
export class TasksSummaryComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  public constructor(
    private projectService: ProjectService,
    private mapperService: MapperService,
    private translationService: TranslationService,
  ) {}

  protected get taskCount(): number {
    return this.projectService
      .loadedProjects()
      .reduce((prev, curr: ProjectDto) => prev + curr.totalTasks, 0);
  }

  protected barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  protected barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  protected updateChartData(): void {
    const projects = this.projectService.loadedProjects();

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
        this.mapperService.taskStatusMapper(status as TaskStatus),
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

    const subscription = this.translationService
      .onLanguageChange()
      .subscribe(() => this.updateChartData());

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
