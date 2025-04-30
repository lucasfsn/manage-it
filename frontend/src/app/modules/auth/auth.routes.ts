import { Routes } from '@angular/router';
import { LoginComponent } from '@/app/modules/auth/pages/login/login.component';
import { SignupComponent } from '@/app/modules/auth/pages/signup/signup.component';

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
