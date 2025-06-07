import { TaskService } from '@/app/features/services/task.service';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { TaskAddAssigneeComponent } from '@/app/modules/task/components/task-add-assignee/task-add-assignee.component';
import { TaskAssigneesListComponent } from '@/app/modules/task/components/task-assignees-list/task-assignees-list.component';
import { UserSummaryDto } from '@/app/shared/dto/user-summary.dto';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-assignees',
  imports: [
    MatIconModule,
    TaskAssigneesListComponent,
    TaskAddAssigneeComponent,
    CommonModule,
  ],
  templateUrl: './task-assignees.component.html',
  styleUrl: './task-assignees.component.scss',
})
export class TaskAssigneesComponent {
  protected showAssignees = true;

  public constructor(private taskService: TaskService) {}

  protected get members(): UserSummaryDto[] {
    return this.taskService.loadedTask()?.members || [];
  }

  protected get isProjectFinished(): boolean {
    const task = this.taskService.loadedTask();
    if (!task) return false;

    return task.projectStatus === ProjectStatus.COMPLETED;
  }

  protected toggleShowAssignees(): void {
    this.showAssignees = true;
  }

  protected toggleShowAddAssignee(): void {
    this.showAssignees = false;
  }
}
