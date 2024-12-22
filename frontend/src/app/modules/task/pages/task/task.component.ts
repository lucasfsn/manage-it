import { Component } from '@angular/core';
import { TaskAssigneesComponent } from '../../components/task-assignees/task-assignees.component';
import { TaskDetailsComponent } from '../../components/task-details/task-details.component';
import { TaskMenuComponent } from '../../components/task-menu/task-menu.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [TaskAssigneesComponent, TaskDetailsComponent, TaskMenuComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {}
