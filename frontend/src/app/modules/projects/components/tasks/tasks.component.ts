import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  Project,
  Task,
  TaskStatus,
} from '../../../../core/models/project.model';
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
  @Input() project!: Project;
  @Input() handleMoveTask!: (task: Task) => void;

  constructor(private dialog: MatDialog) {}

  readonly TaskStatus = TaskStatus;

  public completedTasks: Task[] = [];
  public inProgressTasks: Task[] = [];
  public notStartedTasks: Task[] = [];

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

    this.handleMoveTask({ ...task, status: newStatus });
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
    this.dialog.open(CreateTaskComponent, {
      width: '450px',
      backdropClass: 'dialog-backdrop',
      data: {
        selectedStatus,
        projectId: this.project.id,
      },
    });
  }

  ngOnInit() {
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
