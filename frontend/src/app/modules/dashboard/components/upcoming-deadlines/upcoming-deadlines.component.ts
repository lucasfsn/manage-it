import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project, ProjectStatus } from '../../../../features/dto/project.model';
import { AuthService } from '../../../../features/services/auth.service';
import { ProjectService } from '../../../../features/services/project.service';

@Component({
  selector: 'app-upcoming-deadlines',
  standalone: true,
  imports: [DatePipe, CommonModule, RouterLink],
  templateUrl: './upcoming-deadlines.component.html',
  styleUrl: './upcoming-deadlines.component.css',
})
export class UpcomingDeadlinesComponent {
  constructor(
    private authService: AuthService,
    private projectService: ProjectService
  ) {}

  get projects(): Project[] | undefined {
    return this.projectService
      .loadedProjects()
      ?.filter(
        (project) =>
          this.isUpcomingDeadline(project.endDate) &&
          project.status !== ProjectStatus.Completed
      );
  }

  sortedProjectsByEndDate(): Project[] {
    const projects = this.projects;

    if (!projects) return [];

    return projects
      .slice()
      .sort(
        (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      );
  }

  getDeadlineClass(endDate: string, status: ProjectStatus): string {
    if (status === ProjectStatus.Completed) {
      return 'text-sky-500';
    }

    const daysLeft = this.calculateDaysLeft(endDate);

    if (daysLeft <= 3) {
      return 'text-red-500';
    } else if (daysLeft <= 7) {
      return 'text-yellow-500';
    } else {
      return 'text-green-500';
    }
  }

  getDeadlineMessage(endDate: string, status: ProjectStatus): string {
    if (status === ProjectStatus.Completed) return 'Completed';

    const daysLeft = this.calculateDaysLeft(endDate);

    if (daysLeft === 1) {
      return '1 day left';
    } else {
      return `${daysLeft} days left`;
    }
  }

  calculateDaysLeft(endDate: string): number {
    const currentDate = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  isInProject(project: Project): boolean {
    return project.members.some(
      (member) => member.username === this.authService.getLoggedInUsername()
    );
  }

  private isUpcomingDeadline(endDate: string): boolean {
    const daysLeft = this.calculateDaysLeft(endDate);
    return daysLeft > 0 && daysLeft <= 14;
  }
}
