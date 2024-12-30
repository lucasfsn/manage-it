import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MapperService } from '../../../../core/services/mapper.service';
import { Task, TaskStatus } from '../../../../features/dto/task.model';
import { TaskService } from '../../../../features/services/task.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
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
    ChatComponent,
    ButtonComponent,
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  protected showChat: boolean = false;

  public constructor(
    private taskService: TaskService,
    private mapperService: MapperService,
  ) {}

  protected toggleChat(): void {
    this.showChat = !this.showChat;
  }

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
