import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  Project,
  Task,
  TaskStatus,
} from '../../../../core/models/project.model';
import { PriorityComponent } from '../../../../shared/components/priority/priority.component';
import { AddCardComponent } from '../add-card/add-card.component';
import { EditCardComponent } from '../edit-card/edit-card.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DatePipe,
    CdkDropList,
    CdkDrag,
    AddCardComponent,
    PriorityComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  private dialog = inject(MatDialog);

  @Input() project!: Project;
  @Input() handleUpdate!: (task: Task) => void;

  TaskStatus = TaskStatus;

  completedTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  notStartedTasks: Task[] = [];

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
    this.handleUpdate(event.container.data[event.currentIndex]);
  }

  openAddCardDialog(selectedStatus: TaskStatus): void {
    this.dialog.open(AddCardComponent, {
      width: '450px',
      backdropClass: 'dialog-backdrop',
      data: {
        selectedStatus,
      },
    });
  }

  openEditCardDialog(selectedTask: Task): void {
    this.dialog.open(EditCardComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
      data: {
        selectedTask,
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
