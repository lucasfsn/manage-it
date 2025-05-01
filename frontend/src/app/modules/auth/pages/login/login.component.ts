import { Component } from '@angular/core';
import { LoginFormComponent } from '@/app/modules/auth/components/login-form/login-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [LoginFormComponent]
})
export class LoginComponent {}
