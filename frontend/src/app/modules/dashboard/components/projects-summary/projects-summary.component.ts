import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { Project, ProjectStatus } from '@/app/features/dto/project.model';
import { ProjectService } from '@/app/features/services/project.service';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-projects-summary',
  imports: [BaseChartDirective, TranslateModule],
  templateUrl: './projects-summary.component.html',
  styleUrl: './projects-summary.component.scss',
})
export class ProjectsSummaryComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  public constructor(
    private projectService: ProjectService,
    private mapperService: MapperService,
    private translationService: TranslationService,
  ) {}

  protected activeProjectsCount = 0;
  protected progressChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
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
        onClick: () => null,
      },
    },
  };

  protected get projects(): Project[] {
    return this.projectService.loadedProjects();
  }

  protected updateChart(): void {
    const projects = this.projectService.loadedProjects();

    const inProgress = projects.filter(
      (p) => p.status === ProjectStatus.IN_PROGRESS,
    ).length;
    const completed = projects.filter(
      (p) => p.status === ProjectStatus.COMPLETED,
    ).length;

    this.activeProjectsCount = inProgress;

    this.progressChartData.datasets[0].data = [completed, inProgress];
  }

  private setChartLabels(): void {
    this.progressChartData.labels = [
      this.mapperService.projectStatusMapper(ProjectStatus.COMPLETED),
      this.mapperService.projectStatusMapper(ProjectStatus.IN_PROGRESS),
    ];

    this.updateChart();
  }

  public ngOnInit(): void {
    this.setChartLabels();

    const subscription = this.translationService
      .onLanguageChange()
      .subscribe(() => this.setChartLabels());

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
