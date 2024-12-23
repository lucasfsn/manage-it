import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {
  Project,
  ProjectStatus,
  Task,
  TaskStatus,
} from '../../../../features/dto/project.model';
import { MapperService } from '../../../../features/services/mapper.service';
import { ProjectService } from '../../../../features/services/project.service';
import { TaskService } from '../../../../features/services/task.service';
import { PriorityComponent } from '../../../../shared/components/priority/priority.component';
import { ProfileIconComponent } from '../../../../shared/components/profile-icon/profile-icon.component';
import { DatePipe } from '../../../../shared/pipes/date.pipe';
import { TaskCreateFormComponent } from '../../../task/components/task-create-form/task-create-form.component';

@Component({
  selector: 'app-drag-drop-list',
  standalone: true,
  imports: [
    MatIconModule,
    DatePipe,
    CdkDropList,
    CdkDrag,
    PriorityComponent,
    RouterLink,
    TranslateModule,
    ProfileIconComponent,
  ],
  templateUrl: './drag-drop-list.component.html',
  styleUrl: './drag-drop-list.component.scss',
})
export class DragDropListComponent implements OnInit {
  protected loading: boolean = false;

  public constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private taskService: TaskService,
    private mapperService: MapperService,
    private toastrService: ToastrService
  ) {}

  protected completedTasks: Task[] = [];
  protected inProgressTasks: Task[] = [];
  protected notStartedTasks: Task[] = [];

  protected get project(): Project | null {
    return this.projectService.loadedProject();
  }

  protected get TaskStatus(): typeof TaskStatus {
    return TaskStatus;
  }

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  protected drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
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

  protected openAddCardDialog(selectedStatus: TaskStatus): void {
    if (!this.project) return;

    const dialogRef: MatDialogRef<TaskCreateFormComponent> = this.dialog.open(
      TaskCreateFormComponent,
      {
        width: '450px',
        backdropClass: 'dialog-backdrop',
        data: {
          selectedStatus,
        },
      }
    );

    dialogRef.afterClosed().subscribe((newTask: Task | null) => {
      if (newTask) this.addTaskToList(newTask);
    });
  }

  private addTaskToList(task: Task): void {
    switch (task.status) {
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

  protected handleMoveTask(task: Task, prevStatus: TaskStatus): void {
    if (!this.project) return;

    this.loading = true;
    this.taskService.moveProjectTask(this.project, task).subscribe({
      error: () => {
        const localeMessage = this.mapperService.errorToastMapper();
        this.toastrService.error(localeMessage);
        this.restoreTaskState(task, prevStatus);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  private restoreTaskState(task: Task, prevStatus: TaskStatus): void {
    switch (task.status) {
      case TaskStatus.COMPLETED:
        this.completedTasks = this.completedTasks.filter(
          (t) => t.id !== task.id
        );
        break;
      case TaskStatus.IN_PROGRESS:
        this.inProgressTasks = this.inProgressTasks.filter(
          (t) => t.id !== task.id
        );
        break;
      case TaskStatus.NOT_STARTED:
        this.notStartedTasks = this.notStartedTasks.filter(
          (t) => t.id !== task.id
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

  public ngOnInit(): void {
    if (!this.project) return;

    this.completedTasks = this.project.tasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    );
    this.inProgressTasks = this.project.tasks.filter(
      (task) => task.status === TaskStatus.IN_PROGRESS
    );
    this.notStartedTasks = this.project.tasks.filter(
      (task) => task.status === TaskStatus.NOT_STARTED
    );
  }
}
