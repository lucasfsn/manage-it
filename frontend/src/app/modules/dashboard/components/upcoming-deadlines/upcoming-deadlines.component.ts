import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project, Status } from '../../../../core/models/project.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-upcoming-deadlines',
  standalone: true,
  imports: [DatePipe, CommonModule, RouterLink],
  templateUrl: './upcoming-deadlines.component.html',
  styleUrl: './upcoming-deadlines.component.css',
})
export class UpcomingDeadlinesComponent {
  @Input() projects: Project[] | undefined;

  constructor(private authService: AuthService) {}

  getDeadlineClass(endDate: string, status: Status): string {
    if (status === Status.Completed) {
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

  getDeadlineMessage(endDate: string, status: Status): string {
    if (status === Status.Completed) {
      return 'Completed';
    }
    const daysLeft = this.calculateDaysLeft(endDate);

    if (daysLeft <= 0) {
      return 'Deadline has passed!';
    } else if (daysLeft === 1) {
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
}
