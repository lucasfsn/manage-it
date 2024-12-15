import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../../../features/services/auth.service';
import { passwordValidator } from '../../validators';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
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
  private initialValue = '';

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}

  protected form: FormGroup<LoginForm> = new FormGroup<LoginForm>({
    email: new FormControl(this.initialValue, {
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

  protected get emailIsInvalid(): boolean {
    return (
      this.form.controls.email.dirty &&
      this.form.controls.email.touched &&
      this.form.controls.email.invalid
    );
  }

  protected get passwordIsInvalid(): boolean {
    return (
      this.form.controls.password.dirty &&
      this.form.controls.password.touched &&
      this.form.controls.password.invalid
    );
  }

  protected get passwordErrors(): string | null {
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

  protected onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';

    this.authService.login({ email, password }).subscribe({
      error: (error) => {
        this.toastrService.error(error.message);
      },
      complete: () => {
        this.toastrService.success('Logged in successfully');
      },
    });
  }

  public ngOnInit(): void {
    const savedLoginForm = window.localStorage.getItem('saved-login-form');

    if (savedLoginForm) {
      const loadedData = JSON.parse(savedLoginForm);
      this.initialValue = loadedData.email;
      this.form.controls.email.setValue(this.initialValue);
    }

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
