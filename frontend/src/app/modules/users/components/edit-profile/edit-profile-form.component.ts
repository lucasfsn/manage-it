import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { UpdateUser, User } from '../../../../features/dto/user.model';
import { UserService } from '../../../../features/services/user.service';

import {
  equalValues,
  nameValidator,
  passwordValidator,
} from '../../../../shared/validators';

interface PasswordsForm {
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

interface EditProfileForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  passwords: FormGroup<PasswordsForm>;
}

@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './edit-profile-form.component.html',
  styleUrl: './edit-profile-form.component.scss',
})
export class EditProfileFormComponent implements OnInit {
  public constructor(
    private dialogRef: MatDialogRef<EditProfileFormComponent>,
    private userService: UserService,
    private toastrService: ToastrService
  ) {}

  protected get userData(): User | undefined {
    return this.userService.loadedUser();
  }

  protected form: FormGroup<EditProfileForm> = new FormGroup<EditProfileForm>({
    firstName: new FormControl('', {
      validators: [
        Validators.minLength(2),
        Validators.maxLength(50),
        nameValidator,
      ],
    }),
    lastName: new FormControl('', {
      validators: [
        Validators.minLength(2),
        Validators.maxLength(50),
        nameValidator,
      ],
    }),
    email: new FormControl('', {
      validators: [Validators.email],
    }),
    passwords: new FormGroup<PasswordsForm>(
      {
        password: new FormControl('', {
          validators: [passwordValidator],
        }),
        confirmPassword: new FormControl('', {
          validators: [passwordValidator],
        }),
      },
      {
        validators: [equalValues('password', 'confirmPassword')],
      }
    ),
  });

  protected get disabled(): boolean {
    return this.form.invalid || !this.isFormChanged();
  }

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

  protected get emailIsInvalid(): boolean {
    return (
      this.form.controls.email.dirty &&
      this.form.controls.email.touched &&
      this.form.controls.email.invalid
    );
  }

  protected get passwordIsInvalid(): boolean {
    return !!(
      this.form.controls.passwords.get('password')?.value &&
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

  protected get lastNameErrors(): string | null {
    const control = this.form.controls.lastName;
    if (control.errors) {
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

  protected get emailErrors(): string | null {
    const control = this.form.controls.email;
    if (control.errors) {
      if (control.errors['email']) {
        return 'Email is not valid.';
      }
    }

    return null;
  }

  protected get passwordErrors(): string | null {
    const control = this.form.controls.passwords.get('password');
    if (control?.errors) {
      if (control.errors['invalidPassword']) {
        return 'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.';
      }
    }

    return null;
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  protected onReset(): void {
    this.fillFormWithDefaultValues();
  }

  protected onSubmit(): void {
    if (this.form.invalid || !this.userData) return;

    const updatedUserData: UpdateUser = {
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      email: this.form.value.email!,
      ...(this.form.value.passwords?.password && {
        password: this.form.value.passwords.password,
      }),
    };

    if (!this.isFormChanged()) return;

    this.userService.updateUserData(updatedUserData).subscribe({
      error: (error) => {
        this.toastrService.error(error.message);
      },
    });
    this.closeDialog();
  }

  private isFormChanged(): boolean {
    if (!this.userData) return false;

    return !!(
      this.form.value.firstName !== this.userData.firstName ||
      this.form.value.lastName !== this.userData.lastName ||
      this.form.value.email !== this.userData.email ||
      this.form.value.passwords?.password
    );
  }

  private fillFormWithDefaultValues(): void {
    if (!this.userData) return;

    this.form.patchValue({
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      passwords: {
        password: '',
        confirmPassword: '',
      },
    });
  }

  public ngOnInit(): void {
    this.fillFormWithDefaultValues();
  }
}
