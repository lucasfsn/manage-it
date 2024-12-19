import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { RegisterCredentials } from '../../../../features/dto/auth.model';
import { AuthService } from '../../../../features/services/auth.service';
import { TranslationService } from '../../../../features/services/translation.service';
import {
  equalValues,
  nameValidator,
  passwordValidator,
  usernameValidator,
} from '../../../../shared/validators';

interface PasswordsForm {
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

interface SignupForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  passwords: FormGroup<PasswordsForm>;
}

@Component({
  selector: 'app-signup-form',
  standalone: true,
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
  ],
})
export class SignupFormComponent {
  public constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private translationService: TranslationService
  ) {}

  protected form: FormGroup<SignupForm> = new FormGroup<SignupForm>({
    firstName: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        nameValidator,
      ],
    }),
    lastName: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        nameValidator,
      ],
    }),
    username: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        usernameValidator,
      ],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup<PasswordsForm>(
      {
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            passwordValidator,
          ],
        }),
        confirmPassword: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            passwordValidator,
          ],
        }),
      },
      {
        validators: [equalValues('password', 'confirmPassword')],
      }
    ),
  });

  protected get firstNameIsInvalid(): boolean {
    return (
      this.form.controls.firstName.dirty &&
      this.form.controls.firstName.touched &&
      this.form.controls.firstName.invalid
    );
  }

  protected get lastNameIsInvalid(): boolean {
    return (
      this.form.controls.lastName.dirty &&
      this.form.controls.lastName.touched &&
      this.form.controls.lastName.invalid
    );
  }

  protected get usernameIsInvalid(): boolean {
    return (
      this.form.controls.username.dirty &&
      this.form.controls.username.touched &&
      this.form.controls.username.invalid
    );
  }

  protected get emailIsInvalid(): boolean {
    return (
      this.form.controls.email.dirty &&
      this.form.controls.email.touched &&
      this.form.controls.email.invalid
    );
  }

  protected get passwordIsInvalid(): boolean {
    return !!(
      this.form.controls.passwords.get('password')?.dirty &&
      this.form.controls.passwords.get('password')?.touched &&
      this.form.controls.passwords.get('password')?.invalid
    );
  }

  protected get passwordsDoNotMatch(): boolean {
    return this.form.controls.passwords.hasError('equalValues');
  }

  protected get firstNameErrors(): string | null {
    const control = this.form.controls.firstName;
    if (control.errors) {
      if (control.errors['required']) {
        return this.translationService.translate(
          'signupForm.FIRST_NAME_REQUIRED'
        );
      }
      if (control.errors['minlength']) {
        return `${this.translationService.translate(
          'signupForm.FIRST_NAME_MIN_LENGTH_BEFORE'
        )} ${
          control.errors['minlength'].requiredLength
        } ${this.translationService.translate(
          'signupForm.FIRST_NAME_MIN_LENGTH_AFTER'
        )}`;
      }
      if (control.errors['maxlength']) {
        return `${this.translationService.translate(
          'signupForm.FIRST_NAME_MAX_LENGTH_BEFORE'
        )} ${
          control.errors['maxlength'].requiredLength
        } ${this.translationService.translate(
          'signupForm.FIRST_NAME_MAX_LENGTH_AFTER'
        )}`;
      }
      if (control.errors['invalidName']) {
        return this.translationService.translate(
          'signupForm.FIRST_NAME_INVALID'
        );
      }
    }

    return null;
  }

  protected get lastNameErrors(): string | null {
    const control = this.form.controls.lastName;
    if (control.errors) {
      if (control.errors['required']) {
        return this.translationService.translate(
          'signupForm.LAST_NAME_REQUIRED'
        );
      }
      if (control.errors['minlength']) {
        return `${this.translationService.translate(
          'signupForm.LAST_NAME_MIN_LENGTH_BEFORE'
        )} ${
          control.errors['minlength'].requiredLength
        } ${this.translationService.translate(
          'signupForm.LAST_NAME_MIN_LENGTH_AFTER'
        )}`;
      }
      if (control.errors['maxlength']) {
        return `${this.translationService.translate(
          'signupForm.LAST_NAME_MAX_LENGTH_BEFORE'
        )} ${
          control.errors['maxlength'].requiredLength
        } ${this.translationService.translate(
          'signupForm.LAST_NAME_MAX_LENGTH_AFTER'
        )}`;
      }
      if (control.errors['invalidName']) {
        return this.translationService.translate(
          'signupForm.LAST_NAME_INVALID'
        );
      }
    }

    return null;
  }

  protected get usernameErrors(): string | null {
    const control = this.form.controls.username;
    if (control.errors) {
      if (control.errors['required']) {
        return this.translationService.translate(
          'signupForm.USERNAME_REQUIRED'
        );
      }
      if (control.errors['minlength']) {
        return `${this.translationService.translate(
          'signupForm.USERNAME_MIN_LENGTH_BEFORE'
        )} ${
          control.errors['minlength'].requiredLength
        } ${this.translationService.translate(
          'signupForm.USERNAME_MIN_LENGTH_AFTER'
        )}`;
      }
      if (control.errors['maxlength']) {
        return `${this.translationService.translate(
          'signupForm.USERNAME_MAX_LENGTH_BEFORE'
        )} ${
          control.errors['maxlength'].requiredLength
        } ${this.translationService.translate(
          'signupForm.USERNAME_MAX_LENGTH_AFTER'
        )}`;
      }
      if (control.errors['invalidUsername']) {
        return this.translationService.translate('signupForm.USERNAME_INVALID');
      }
    }

    return null;
  }

  protected get emailErrors(): string | null {
    const control = this.form.controls.email;
    if (control.errors) {
      if (control.errors['required']) {
        return this.translationService.translate('signupForm.EMAIL_REQUIRED');
      }
      if (control.errors['email']) {
        return this.translationService.translate('signupForm.EMAIL_INVALID');
      }
    }

    return null;
  }

  protected get passwordErrors(): string | null {
    const control = this.form.controls.passwords.get('password');
    if (control?.errors) {
      if (control.errors['required']) {
        return this.translationService.translate(
          'signupForm.PASSWORD_REQUIRED'
        );
      }
      if (control.errors['invalidPassword']) {
        return this.translationService.translate('signupForm.PASSWORD_INVALID');
      }
    }

    return null;
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const registerCredentials: RegisterCredentials = {
      firstName: this.form.value.firstName ?? '',
      lastName: this.form.value.lastName ?? '',
      username: this.form.value.username ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.passwords?.password ?? '',
    };

    this.authService.register(registerCredentials).subscribe({
      error: (error) => {
        this.toastrService.error(error.message);
      },
      complete: () => {
        this.toastrService.success(
          this.translationService.translate('toast.success.SIGNUP')
        );
      },
    });
  }

  protected onReset(): void {
    this.form.reset();
  }
}
