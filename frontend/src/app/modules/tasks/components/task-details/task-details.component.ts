import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Task, TaskStatus } from '../../../../features/dto/project.model';
import { MappersService } from '../../../../features/services/mappers.service';
import { TaskService } from '../../../../features/services/task.service';
import { PriorityComponent } from '../../../../shared/components/priority/priority.component';
import { ShowMoreMembersComponent } from '../../../../shared/components/show-more-members/show-more-members.component';
import { DatePipe } from '../../../../shared/pipes/date.pipe';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    PriorityComponent,
    TranslateModule,
    DatePipe,
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  public constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private mappersService: MappersService
  ) {}

  protected get TaskStatus(): typeof TaskStatus {
    return TaskStatus;
  }

  protected get task(): Task | undefined {
    return this.taskService.loadedTask();
  }

  protected mapTaskStatus(): string {
    if (!this.task) return '';

    return this.mappersService.taskStatusMapper(this.task.status);
  }

  protected showAllMembers(isOnlyShow: boolean): void {
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
