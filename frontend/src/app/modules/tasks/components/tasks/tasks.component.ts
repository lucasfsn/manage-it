import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Task, TaskStatus } from '../../../../features/dto/project.model';
import { ProjectService } from '../../../../features/services/project.service';
import { TaskService } from '../../../../features/services/task.service';
import { PriorityComponent } from '../../../../shared/components/priority/priority.component';
import { CreateTaskComponent } from '../create-task/create-task.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DatePipe,
    CdkDropList,
    CdkDrag,
    PriorityComponent,
    RouterLink,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private taskService: TaskService,
    private toastrService: ToastrService
  ) {}

  public completedTasks: Task[] = [];
  public inProgressTasks: Task[] = [];
  public notStartedTasks: Task[] = [];

  get project() {
    return this.projectService.loadedProject();
  }

  get TaskStatus(): typeof TaskStatus {
    return TaskStatus;
  }

  drop(event: CdkDragDrop<Task[]>) {
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
        return TaskStatus.Completed;
      case 'inProgress':
        return TaskStatus.InProgress;
      default:
        return TaskStatus.NotStarted;
    }
  }

  openAddCardDialog(selectedStatus: TaskStatus): void {
    if (!this.project) return;

    this.dialog.open(CreateTaskComponent, {
      width: '450px',
      backdropClass: 'dialog-backdrop',
      data: {
        selectedStatus,
      },
    });
  }

  handleMoveTask(task: Task, prevStatus: TaskStatus) {
    this.taskService.moveProjectTask(task).subscribe({
      error: (err) => {
        this.toastrService.error(err.message);
        this.restoreTaskState(task, prevStatus);
      },
    });
  }

  private restoreTaskState(task: Task, prevStatus: TaskStatus) {
    switch (task.status) {
      case TaskStatus.Completed:
        this.completedTasks = this.completedTasks.filter(
          (t) => t.id !== task.id
        );
        break;
      case TaskStatus.InProgress:
        this.inProgressTasks = this.inProgressTasks.filter(
          (t) => t.id !== task.id
        );
        break;
      case TaskStatus.NotStarted:
        this.notStartedTasks = this.notStartedTasks.filter(
          (t) => t.id !== task.id
        );
        break;
    }

    switch (prevStatus) {
      case TaskStatus.Completed:
        this.completedTasks.push(task);
        break;
      case TaskStatus.InProgress:
        this.inProgressTasks.push(task);
        break;
      case TaskStatus.NotStarted:
        this.notStartedTasks.push(task);
        break;
    }
  }

  ngOnInit() {
    if (!this.project) return;

    this.completedTasks = this.project.tasks.filter(
      (task) => task.status === TaskStatus.Completed
    );
    this.inProgressTasks = this.project.tasks.filter(
      (task) => task.status === TaskStatus.InProgress
    );
    this.notStartedTasks = this.project.tasks.filter(
      (task) => task.status === TaskStatus.NotStarted
    );
  }
}
