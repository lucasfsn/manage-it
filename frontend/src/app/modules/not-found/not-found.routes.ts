import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const NOT_FOUND_ROUTES: Routes = [
  {
    path: '',
    component: NotFoundComponent,
    data: {
      title: 'title.NOT_FOUND',
    },
  },
];
