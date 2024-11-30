import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { UserCredentials } from '../../../../core/models/auth.model';
import { UpdateUser } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import {
  equalValues,
  nameValidator,
  passwordValidator,
} from '../../validators';

@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './edit-profile-form.component.html',
  styleUrl: './edit-profile-form.component.css',
})
export class EditProfileFormComponent {
  constructor(
    private dialogRef: MatDialogRef<EditProfileFormComponent>,
    private userService: UserService,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {}

  get userData(): UserCredentials | null {
    return this.authService.loadedUser();
  }

  form = new FormGroup({
    firstName: new FormControl<string>('', {
      validators: [
        Validators.minLength(2),
        Validators.maxLength(50),
        nameValidator,
      ],
    }),
    lastName: new FormControl<string>('', {
      validators: [
        Validators.minLength(2),
        Validators.maxLength(50),
        nameValidator,
      ],
    }),
    email: new FormControl<string>('', {
      validators: [Validators.email],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl<string>('', {
          validators: [passwordValidator],
        }),
        confirmPassword: new FormControl<string>('', {
          validators: [passwordValidator],
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

  get emailIsInvalid() {
    return (
      this.form.controls.email.dirty &&
      this.form.controls.email.touched &&
      this.form.controls.email.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.passwords.get('password')?.value &&
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

  get emailErrors() {
    const control = this.form.controls.email;
    if (control.errors) {
      if (control.errors['email']) {
        return 'Email is not valid.';
      }
    }
    return null;
  }

  get passwordErrors() {
    const control = this.form.controls.passwords.get('password');
    if (control?.errors) {
      if (control.errors['invalidPassword']) {
        return 'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.';
      }
    }
    return null;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private fillFormWithDefaultValues() {
    if (!this.userData) return;

    this.form.patchValue({
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
    });
  }

  onReset() {
    this.fillFormWithDefaultValues();
  }

  onSubmit() {
    if (this.form.invalid || !this.userData) return;

    const updatedUserData: UpdateUser = {
      firstName: this.form.value.firstName ?? this.userData.firstName,
      lastName: this.form.value.lastName ?? this.userData.lastName,
      email: this.form.value.email ?? this.userData.email!,
    };

    if (this.form.value.passwords?.password) {
      updatedUserData.password = this.form.value.passwords.password;
    }

    const formChanged =
      updatedUserData.firstName !== this.userData.firstName ||
      updatedUserData.lastName !== this.userData.lastName ||
      updatedUserData.email !== this.userData.email ||
      updatedUserData.password;

    if (!formChanged) return;

    this.userService.updateUserData(updatedUserData).subscribe({
      error: (error) => {
        this.toastrService.error(error.message);
      },
    });
    this.closeDialog();
  }

  ngOnInit(): void {
    this.fillFormWithDefaultValues();
  }
}
