import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Task, TaskStatus } from '../../../../features/dto/project.model';
import { TaskService } from '../../../../features/services/task.service';
import { PriorityComponent } from '../../../../shared/components/priority/priority.component';
import { ShowMoreMembersComponent } from '../../../../shared/components/show-more-members/show-more-members.component';
import { taskStatusMapper } from '../../../../shared/utils/status-mapper';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    CommonModule,
    DatePipe,
    PriorityComponent,
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css',
})
export class TaskDetailsComponent {
  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  get TaskStatus(): typeof TaskStatus {
    return TaskStatus;
  }

  get task(): Task | undefined {
    return this.taskService.loadedTask();
  }

  mapTaskStatus(): string {
    if (!this.task) return '';

    return taskStatusMapper(this.task.status);
  }

  showAllMembers(isOnlyShow: boolean): void {
    this.dialog.open(ShowMoreMembersComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
      data: {
        isOnlyShow,
        isOnProject: false,
      },
    });
  }
}
