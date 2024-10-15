import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

function passwordValidator(control: AbstractControl) {
  const passwordRegex =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  if (passwordRegex.test(control.value)) return null;

  return {
    invalidPassword: true,
  };
}

let initialValue = '';
const savedLoginForm = window.localStorage.getItem('saved-login-form');
if (savedLoginForm) {
  const loadedForm = JSON.parse(savedLoginForm);
  initialValue = loadedForm.email;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  constructor(
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  form = new FormGroup({
    email: new FormControl(initialValue, {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        passwordValidator,
      ],
    }),
  });

  get emailIsInvalid() {
    return (
      this.form.controls.email.dirty &&
      this.form.controls.email.touched &&
      this.form.controls.email.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.password.dirty &&
      this.form.controls.password.touched &&
      this.form.controls.password.invalid
    );
  }

  get passwordErrors() {
    const control = this.form.controls.password;
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Password is required.';
      }
      if (control.errors['invalidPassword']) {
        return 'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.';
      }
    }
    return null;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const email = this.form.value.email as string;
    const password = this.form.value.password as string;

    this.authService.login({ email, password }).subscribe();

    this.toastr.success('Logged in successfully!');
  }

  ngOnInit() {
    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email })
          );
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
