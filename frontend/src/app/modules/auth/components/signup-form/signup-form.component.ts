import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RegisterCredentials } from '../../../../core/models/auth.model';
import { AuthService } from '../../../../core/services/auth.service';
import {
  equalValues,
  nameValidator,
  passwordValidator,
  usernameValidator,
} from '../../validators';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css',
  imports: [ReactiveFormsModule, RouterLink],
})
export class SignupFormComponent {
  constructor(private authService: AuthService) {}

  form = new FormGroup({
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
        Validators.minLength(2),
        Validators.maxLength(20),
        usernameValidator,
      ],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup(
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

  get firstNameIsInvalid() {
    return (
      this.form.controls.firstName.dirty &&
      this.form.controls.firstName.touched &&
      this.form.controls.firstName.invalid
    );
  }

  get lastNameIsInvalid() {
    return (
      this.form.controls.lastName.dirty &&
      this.form.controls.lastName.touched &&
      this.form.controls.lastName.invalid
    );
  }

  get usernameIsInvalid() {
    return (
      this.form.controls.username.dirty &&
      this.form.controls.username.touched &&
      this.form.controls.username.invalid
    );
  }

  get emailIsInvalid() {
    return (
      this.form.controls.email.dirty &&
      this.form.controls.email.touched &&
      this.form.controls.email.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.passwords.get('password')?.dirty &&
      this.form.controls.passwords.get('password')?.touched &&
      this.form.controls.passwords.get('password')?.invalid
    );
  }

  get passwordsDoNotMatch() {
    return this.form.controls.passwords.hasError('equalValues');
  }

  get firstNameErrors() {
    const control = this.form.controls.firstName;
    if (control.errors) {
      if (control.errors['required']) {
        return 'First name is required.';
      }
      if (control.errors['minlength']) {
        return `First name must be at least ${control.errors['minlength'].requiredLength} characters long.`;
      }
      if (control.errors['maxlength']) {
        return `First name cannot be more than ${control.errors['maxlength'].requiredLength} characters long.`;
      }
      if (control.errors['invalidName']) {
        return 'First name cannot contain numbers and special characters.';
      }
    }
    return null;
  }

  get lastNameErrors() {
    const control = this.form.controls.lastName;
    if (control.errors) {
      if (control.errors['required']) {
        return 'Last name is required.';
      }
      if (control.errors['minlength']) {
        return `Last name must be at least ${control.errors['minlength'].requiredLength} characters long.`;
      }
      if (control.errors['maxlength']) {
        return `Last name cannot be more than ${control.errors['maxlength'].requiredLength} characters long.`;
      }
      if (control.errors['invalidName']) {
        return 'Last name cannot contain numbers and special characters.';
      }
    }
    return null;
  }

  get usernameErrors() {
    const control = this.form.controls.username;
    if (control.errors) {
      if (control.errors['required']) {
        return 'Username is required.';
      }
      if (control.errors['minlength']) {
        return `Username must be at least ${control.errors['minlength'].requiredLength} characters long.`;
      }
      if (control.errors['maxlength']) {
        return `Username cannot be more than ${control.errors['maxlength'].requiredLength} characters long.`;
      }
      if (control.errors['invalidName']) {
        return 'Username cannot contain numbers and special characters.';
      }
    }
    return null;
  }

  get emailErrors() {
    const control = this.form.controls.email;
    if (control.errors) {
      if (control.errors['required']) {
        return 'Email is required.';
      }
      if (control.errors['email']) {
        return 'Email is not valid.';
      }
    }
    return null;
  }

  get passwordErrors() {
    const control = this.form.controls.passwords.get('password');
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

    const registerCredentials: RegisterCredentials = {
      firstName: this.form.value.firstName ?? '',
      lastName: this.form.value.lastName ?? '',
      username: this.form.value.username ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.passwords?.password ?? '',
    };

    this.authService.register(registerCredentials).subscribe();
  }

  onReset() {
    this.form.reset();
  }
}
