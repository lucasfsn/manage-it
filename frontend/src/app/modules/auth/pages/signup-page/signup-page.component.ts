import { Component } from '@angular/core';
import { SignupFormComponent } from '../../components/signup-form/signup-form.component';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css',
  imports: [SignupFormComponent],
})
export class SignupPageComponent {}
