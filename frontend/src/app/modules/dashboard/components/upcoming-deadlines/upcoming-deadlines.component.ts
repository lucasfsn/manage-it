import { TranslationService } from '@/app/core/services/translation.service';
import { ProjectDto } from '@/app/features/dto/project.dto';
import { ProjectService } from '@/app/features/services/project.service';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { DatePipe } from '@/app/shared/pipes/date.pipe';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-upcoming-deadlines',
  imports: [DatePipe, RouterLink, TranslateModule],
  templateUrl: './upcoming-deadlines.component.html',
  styleUrl: './upcoming-deadlines.component.scss',
})
export class UpcomingDeadlinesComponent {
  private readonly DEADLINE_THRESHOLD_DAYS = 14;

  public constructor(
    private projectService: ProjectService,
    private translationService: TranslationService,
  ) {}

  protected get projects(): ProjectDto[] {
    return this.projectService
      .loadedProjects()
      .filter(
        (project) =>
          this.calculateDaysLeft(project.endDate) <=
            this.DEADLINE_THRESHOLD_DAYS &&
          project.status !== ProjectStatus.COMPLETED,
      );
  }

  protected sortedProjectsByEndDate(): ProjectDto[] {
    return this.projects.toSorted(
      (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    );
  }

  protected deadlineClass(endDate: string): string {
    const daysLeft = this.calculateDaysLeft(endDate);

    if (daysLeft < 0) return 'text-red-900';

    if (daysLeft <= 1) return 'text-red-700 dark:text-red-500';

    if (daysLeft <= 7) return 'text-yellow-700 dark:text-yellow-500';

    return 'text-green-700 dark:text-green-500';
  }

  protected deadlineMessage(endDate: string): string {
    const daysLeft = this.calculateDaysLeft(endDate);

    if (daysLeft < 0)
      return this.translationService.translate(
        'dashboard.upcomingDeadlines.OVERDUE',
      );

    if (daysLeft === 0)
      return this.translationService.translate(
        'dashboard.upcomingDeadlines.TODAY',
      );

    if (daysLeft === 1)
      return this.translationService.translate(
        'dashboard.upcomingDeadlines.DAY_LEFT',
      );

    return this.translationService.translate(
      'dashboard.upcomingDeadlines.DAYS_LEFT',
      {
        daysLeft,
      },
    );
  }

  protected calculateDaysLeft(endDate: string): number {
    const currentDate = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - currentDate.getTime();

    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
}
