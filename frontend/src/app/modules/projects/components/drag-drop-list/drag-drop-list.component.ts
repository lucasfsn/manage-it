import { MapperService } from '@/app/core/services/mapper.service';
import { UserDto } from '@/app/features/dto/auth.model';
import { ProjectDto } from '@/app/features/dto/project.model';
import { TaskDto } from '@/app/features/dto/task.model';
import { AuthService } from '@/app/features/services/auth.service';
import { ProjectService } from '@/app/features/services/project.service';
import { TaskService } from '@/app/features/services/task.service';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { TaskCreateFormComponent } from '@/app/modules/task/components/task-create-form/task-create-form.component';
import { TaskPriorityComponent } from '@/app/modules/task/components/task-priority/task-priority.component';
import { TaskStatus } from '@/app/modules/task/types/task-status.type';
import { ProfileIconComponent } from '@/app/shared/components/ui/profile-icon/profile-icon.component';
import { UserSummaryDto } from '@/app/shared/dto/user-summary.model';
import { DatePipe } from '@/app/shared/pipes/date.pipe';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-drag-drop-list',
  imports: [
    MatIconModule,
    DatePipe,
    CdkDropList,
    CdkDrag,
    RouterLink,
    TranslateModule,
    ProfileIconComponent,
    MatTooltipModule,
    CommonModule,
    TaskPriorityComponent,
  ],
  templateUrl: './drag-drop-list.component.html',
  styleUrl: './drag-drop-list.component.scss',
})
export class DragDropListComponent implements OnInit {
  protected loading: boolean = false;
  protected onlyMyTasks: boolean = false;

  public constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private taskService: TaskService,
    private mapperService: MapperService,
    private toastrService: ToastrService,
    private authService: AuthService,
  ) {}

  protected completedTasks: TaskDto[] = [];
  protected inProgressTasks: TaskDto[] = [];
  protected notStartedTasks: TaskDto[] = [];

  protected get project(): ProjectDto | null {
    return this.projectService.loadedProject();
  }

  protected get TaskStatus(): typeof TaskStatus {
    return TaskStatus;
  }

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  protected get currentUser(): UserDto | null {
    return this.authService.loadedUser();
  }

  protected get isDragAndDropDisabled(): boolean {
    return this.loading || this.project?.status === ProjectStatus.COMPLETED;
  }

  protected toggleOnlyMyTasks(): void {
    this.onlyMyTasks = !this.onlyMyTasks;
    this.groupTasksByStatus();
  }

  protected drop(event: CdkDragDrop<TaskDto[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    const task = event.container.data[event.currentIndex];
    const newStatus = this.getNewStatus(event.container.id);

    if (task.status === newStatus) return;

    this.handleMoveTask({ ...task, status: newStatus }, task.status);
  }

  private getNewStatus(containerId: string): TaskStatus {
    switch (containerId) {
      case 'completed':
        return TaskStatus.COMPLETED;
      case 'inProgress':
        return TaskStatus.IN_PROGRESS;
      default:
        return TaskStatus.NOT_STARTED;
    }
  }

  protected openAddTaskDialog(selectedStatus: TaskStatus): void {
    if (!this.project) return;

    const dialogRef: MatDialogRef<TaskCreateFormComponent> = this.dialog.open(
      TaskCreateFormComponent,
      {
        width: '600px',
        backdropClass: 'dialog-backdrop',
        data: {
          selectedStatus,
        },
      },
    );

    dialogRef.afterClosed().subscribe((newTask: TaskDto | null) => {
      if (newTask) this.groupTasksByStatus();
    });
  }

  protected handleMoveTask(task: TaskDto, prevStatus: TaskStatus): void {
    if (!this.project) return;

    this.loading = true;
    this.taskService.moveProjectTask(this.project, task).subscribe({
      error: (error: ErrorResponse) => {
        const localeMessage = this.mapperService.errorToastMapper(
          error.code,
          'task',
        );
        this.toastrService.error(localeMessage);
        this.restoreTaskState(task, prevStatus);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  private restoreTaskState(task: TaskDto, prevStatus: TaskStatus): void {
    switch (task.status) {
      case TaskStatus.COMPLETED:
        this.completedTasks = this.completedTasks.filter(
          (t) => t.id !== task.id,
        );
        break;
      case TaskStatus.IN_PROGRESS:
        this.inProgressTasks = this.inProgressTasks.filter(
          (t) => t.id !== task.id,
        );
        break;
      case TaskStatus.NOT_STARTED:
        this.notStartedTasks = this.notStartedTasks.filter(
          (t) => t.id !== task.id,
        );
        break;
    }

    switch (prevStatus) {
      case TaskStatus.COMPLETED:
        this.completedTasks.push(task);
        break;
      case TaskStatus.IN_PROGRESS:
        this.inProgressTasks.push(task);
        break;
      case TaskStatus.NOT_STARTED:
        this.notStartedTasks.push(task);
        break;
    }
  }

  private filterTasks(): TaskDto[] {
    if (!this.project) return [];

    const username = this.authService.getLoggedInUsername();

    const tasks = this.project.tasks
      .toSorted(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      )
      .reverse();

    if (!this.onlyMyTasks) return tasks;

    return tasks.filter((task) =>
      task.members.some(
        (member: UserSummaryDto) => member.username === username,
      ),
    );
  }

  private groupTasksByStatus(): void {
    const tasks = this.filterTasks();

    this.completedTasks = tasks.filter(
      (task) => task.status === TaskStatus.COMPLETED,
    );
    this.inProgressTasks = tasks.filter(
      (task) => task.status === TaskStatus.IN_PROGRESS,
    );
    this.notStartedTasks = tasks.filter(
      (task) => task.status === TaskStatus.NOT_STARTED,
    );
  }

  public ngOnInit(): void {
    this.groupTasksByStatus();
  }
}
