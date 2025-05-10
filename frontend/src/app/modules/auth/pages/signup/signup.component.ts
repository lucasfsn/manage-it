import { Component } from '@angular/core';
import { SignupFormComponent } from '@/app/modules/auth/components/signup-form/signup-form.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  imports: [SignupFormComponent]
})
export class SignupComponent {}
