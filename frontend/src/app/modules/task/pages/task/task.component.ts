import { Component } from '@angular/core';
import { TaskAssigneesComponent } from '@/app/modules/task/components/task-assignees/task-assignees.component';
import { TaskDetailsComponent } from '@/app/modules/task/components/task-details/task-details.component';
import { TaskMenuComponent } from '@/app/modules/task/components/task-menu/task-menu.component';

@Component({
    selector: 'app-task',
    imports: [TaskAssigneesComponent, TaskDetailsComponent, TaskMenuComponent],
    templateUrl: './task.component.html',
    styleUrl: './task.component.scss'
})
export class TaskComponent {}
