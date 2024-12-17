import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login | ManageIt',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign Up | ManageIt',
  },
];
