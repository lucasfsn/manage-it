import { MapperService } from '@/app/core/services/mapper.service';
import { TaskDto } from '@/app/features/dto/task.model';
import { TaskService } from '@/app/features/services/task.service';
import { TaskPriorityComponent } from '@/app/modules/task/components/task-priority/task-priority.component';
import { TaskStatus } from '@/app/modules/task/types/task-status.type';
import { ChatToggleComponent } from '@/app/shared/components/chat-toggle/chat-toggle.component';
import { ProfileIconComponent } from '@/app/shared/components/ui/profile-icon/profile-icon.component';
import { DatePipe } from '@/app/shared/pipes/date.pipe';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-details',
  imports: [
    MatIconModule,
    RouterLink,
    TranslateModule,
    DatePipe,
    ProfileIconComponent,
    ChatToggleComponent,
    TaskPriorityComponent,
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  public constructor(
    private taskService: TaskService,
    private mapperService: MapperService,
  ) {}

  protected get TaskStatus(): typeof TaskStatus {
    return TaskStatus;
  }

  protected get task(): TaskDto | null {
    return this.taskService.loadedTask();
  }

  protected mapTaskStatus(): string {
    if (!this.task) return '';

    return this.mapperService.taskStatusMapper(this.task.status);
  }
}
