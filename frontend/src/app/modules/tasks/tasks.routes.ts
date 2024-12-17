import { Routes } from '@angular/router';
import { TaskComponent } from './pages/task/task.component';

export const TASKS_ROUTES: Routes = [
  {
    path: ':taskId',
    component: TaskComponent,
    title: 'Task Details | ManageIt',
  },
];
