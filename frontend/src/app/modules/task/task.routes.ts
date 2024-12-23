import { Routes } from '@angular/router';
import { TaskComponent } from './pages/task/task.component';
import { taskResolver } from './resolvers/task.resolver';

export const TASK_ROUTES: Routes = [
  {
    path: ':taskId',
    component: TaskComponent,
    resolve: {
      taskResolver,
    },
    data: {
      title: 'title.TASK',
    },
  },
];
