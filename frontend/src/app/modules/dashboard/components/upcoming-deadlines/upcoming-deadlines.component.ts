import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Project, ProjectStatus } from '../../../../features/dto/project.model';
import { AuthService } from '../../../../features/services/auth.service';
import { ProjectService } from '../../../../features/services/project.service';
import { TranslationService } from '../../../../features/services/translation.service';
import { CustomDatePipe } from '../../../../shared/pipes/custom-date.pipe';

@Component({
  selector: 'app-upcoming-deadlines',
  standalone: true,
  imports: [CustomDatePipe, RouterLink, TranslateModule],
  templateUrl: './upcoming-deadlines.component.html',
  styleUrl: './upcoming-deadlines.component.scss',
})
export class UpcomingDeadlinesComponent {
  public constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private translationService: TranslationService
  ) {}

  protected get projects(): Project[] | undefined {
    return this.projectService
      .loadedProjects()
      ?.filter(
        (project) =>
          this.isUpcomingDeadline(project.endDate) &&
          project.status !== ProjectStatus.COMPLETED
      );
  }

  protected sortedProjectsByEndDate(): Project[] {
    const projects = this.projects;

    if (!projects) return [];

    return projects
      .slice()
      .sort(
        (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      );
  }

  protected deadlineClass(endDate: string, status: ProjectStatus): string {
    if (status === ProjectStatus.COMPLETED) {
      return 'text-sky-500';
    }

    const daysLeft = this.calculateDaysLeft(endDate);

    if (daysLeft <= 3) {
      return 'text-red-500';
    }

    if (daysLeft <= 7) {
      return 'text-yellow-500';
    }

    return 'text-green-500';
  }

  protected deadlineMessage(endDate: string, status: ProjectStatus): string {
    if (status === ProjectStatus.COMPLETED) return 'Completed';

    const daysLeft = this.calculateDaysLeft(endDate);

    if (daysLeft === 1) {
      return this.translationService.translate(
        'dashboard.upcomingDeadlines.DAY_LEFT'
      );
    }

    return `${daysLeft} ${this.translationService.translate(
      'dashboard.upcomingDeadlines.DAYS_LEFT'
    )}`;
  }

  protected calculateDaysLeft(endDate: string): number {
    const currentDate = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - currentDate.getTime();

    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  protected isInProject(project: Project): boolean {
    return project.members.some(
      (member) => member.username === this.authService.getLoggedInUsername()
    );
  }

  private isUpcomingDeadline(endDate: string): boolean {
    const daysLeft = this.calculateDaysLeft(endDate);

    return daysLeft > 0 && daysLeft <= 30;
  }
}
