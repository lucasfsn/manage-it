import { Routes } from '@angular/router';
import { TaskComponent } from './pages/task/task.component';
import { tasksResolver } from './resolvers/tasks.resolver';

export const TASKS_ROUTES: Routes = [
  {
    path: ':taskId',
    component: TaskComponent,
    resolve: {
      tasksResolver,
    },
    data: {
      title: 'title.TASK',
    },
  },
];
