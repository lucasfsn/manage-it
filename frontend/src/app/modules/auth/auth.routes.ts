import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'title.LOGIN',
    },
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: {
      title: 'title.SIGNUP',
    },
  },
];
