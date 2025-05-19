import { Task, TaskStatus } from '@/app/features/dto/task.model';
import { TaskService } from '@/app/features/services/task.service';
import { ChatComponent } from '@/app/shared/components/chat/chat.component';
import { ButtonComponent } from '@/app/shared/components/ui/button/button.component';
import { PriorityComponent } from '@/app/shared/components/ui/priority/priority.component';
import { ProfileIconComponent } from '@/app/shared/components/ui/profile-icon/profile-icon.component';
import { DatePipe } from '@/app/shared/pipes/date.pipe';
import { MapperService } from '@/app/shared/services/mapper.service';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-details',
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
