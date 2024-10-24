import { Component } from '@angular/core';
import { SignupFormComponent } from '../../components/signup-form/signup-form.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [SignupFormComponent],
})
export class SignupComponent {}
