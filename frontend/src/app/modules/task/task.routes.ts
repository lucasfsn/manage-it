import { TaskComponent } from '@/app/modules/task/pages/task/task.component';
import { taskResolver } from '@/app/modules/task/resolvers/task.resolver';
import { Routes } from '@angular/router';

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
