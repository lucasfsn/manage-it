import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Project } from '../../../../core/models/project.model';

@Component({
  selector: 'app-upcoming-deadlines',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './upcoming-deadlines.component.html',
  styleUrl: './upcoming-deadlines.component.css',
})
export class UpcomingDeadlinesComponent {
  @Input() projects: Project[] | undefined;

  getDeadlineClass(endDate: string): string {
    const daysLeft = this.calculateDaysLeft(endDate);
    if (daysLeft <= 3) {
      return 'text-red-500';
    } else if (daysLeft <= 7) {
      return 'text-yellow-500';
    } else {
      return 'text-green-500';
    }
  }

  getDeadlineMessage(endDate: string): string {
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
}
