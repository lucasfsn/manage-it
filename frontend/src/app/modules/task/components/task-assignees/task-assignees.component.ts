import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../features/dto/project.model';
import { TaskService } from '../../../../features/services/task.service';
import { TaskAddAssigneeComponent } from '../task-add-assignee/task-add-assignee.component';
import { TaskAssigneesListComponent } from '../task-assignees-list/task-assignees-list.component';

@Component({
  selector: 'app-task-assignees',
  standalone: true,
  imports: [
    MatIconModule,
    TaskAssigneesListComponent,
    TaskAddAssigneeComponent,
  ],
  templateUrl: './task-assignees.component.html',
  styleUrl: './task-assignees.component.scss',
})
export class TaskAssigneesComponent {
  protected showAssignees = true;

  public constructor(private taskService: TaskService) {}

  protected get members(): User[] {
    return this.taskService.loadedTask()?.members || [];
  }

  protected toggleShowAssignees(): void {
    this.showAssignees = true;
  }

  protected toggleShowAddAssignee(): void {
    this.showAssignees = false;
  }
}
