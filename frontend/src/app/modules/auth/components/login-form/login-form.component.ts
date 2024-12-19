import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../../../features/services/auth.service';
import { TranslationService } from '../../../../features/services/translation.service';
import { passwordValidator } from '../../../../shared/validators';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  public constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private translationService: TranslationService
  ) {}

  protected form: FormGroup<LoginForm> = new FormGroup<LoginForm>({
    email: new FormControl('', {
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
    if (control.errors) {
      if (control.errors['required']) {
        return this.translationService.translate('loginForm.PASSWORD_REQUIRED');
      }
      if (control.errors['invalidPassword']) {
        return this.translationService.translate('loginForm.PASSWORD_INVALID');
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
        this.toastrService.success(
          this.translationService.translate('toast.success.LOGIN')
        );
      },
    });
  }

  public ngOnInit(): void {
    const savedLoginForm = window.localStorage.getItem('saved-login-form');

    if (savedLoginForm) {
      const loadedData = JSON.parse(savedLoginForm) as { email: string | null };
      this.form.controls.email.setValue(loadedData.email);
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
