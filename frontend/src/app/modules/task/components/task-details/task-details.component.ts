import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MapperService } from '../../../../core/services/mapper.service';
import { Task, TaskStatus } from '../../../../features/dto/task.model';
import { TaskService } from '../../../../features/services/task.service';
import { PriorityComponent } from '../../../../shared/components/priority/priority.component';
import { ProfileIconComponent } from '../../../../shared/components/profile-icon/profile-icon.component';
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
    ProfileIconComponent,
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  public constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private mapperService: MapperService
  ) {}

  protected get TaskStatus(): typeof TaskStatus {
    return TaskStatus;
  }

  protected get task(): Task | null {
    return this.taskService.loadedTask();
  }

  protected mapTaskStatus(): string {
    if (!this.task) return '';

    return this.mapperService.taskStatusMapper(this.task.status);
  }
}
