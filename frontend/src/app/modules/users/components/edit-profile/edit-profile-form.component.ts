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

import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../../../features/services/translation.service';
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
  imports: [ReactiveFormsModule, MatIconModule, TranslateModule],
  templateUrl: './edit-profile-form.component.html',
  styleUrl: './edit-profile-form.component.scss',
})
export class EditProfileFormComponent implements OnInit {
  public constructor(
    private dialogRef: MatDialogRef<EditProfileFormComponent>,
    private userService: UserService,
    private toastrService: ToastrService,
    private translationService: TranslationService
  ) {}

  protected get userData(): User | undefined {
    return this.userService.loadedUser();
  }

  protected form: FormGroup<EditProfileForm> = new FormGroup<EditProfileForm>({
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
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
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
      if (control.errors['required']) {
        return this.translationService.translate(
          'user.editForm.FIRST_NAME_REQUIRED'
        );
      }
      if (control.errors['minlength']) {
        return `${this.translationService.translate(
          'user.editForm.FIRST_NAME_MIN_LENGTH_BEFORE'
        )} ${
          control.errors['minlength'].requiredLength
        } ${this.translationService.translate(
          'user.editForm.FIRST_NAME_MIN_LENGTH_AFTER'
        )}`;
      }
      if (control.errors['maxlength']) {
        return `${this.translationService.translate(
          'user.editForm.FIRST_NAME_MAX_LENGTH_BEFORE'
        )} ${
          control.errors['maxlength'].requiredLength
        } ${this.translationService.translate(
          'user.editForm.FIRST_NAME_MAX_LENGTH_AFTER'
        )}`;
      }
      if (control.errors['invalidName']) {
        return this.translationService.translate(
          'user.editForm.FIRST_NAME_INVALID'
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
          'user.editForm.LAST_NAME_REQUIRED'
        );
      }
      if (control.errors['minlength']) {
        return `${this.translationService.translate(
          'user.editForm.LAST_NAME_MIN_LENGTH_BEFORE'
        )} ${
          control.errors['minlength'].requiredLength
        } ${this.translationService.translate(
          'user.editForm.LAST_NAME_MIN_LENGTH_AFTER'
        )}`;
      }
      if (control.errors['maxlength']) {
        return `${this.translationService.translate(
          'user.editForm.LAST_NAME_MAX_LENGTH_BEFORE'
        )} ${
          control.errors['maxlength'].requiredLength
        } ${this.translationService.translate(
          'user.editForm.LAST_NAME_MAX_LENGTH_AFTER'
        )}`;
      }
      if (control.errors['invalidName']) {
        return this.translationService.translate(
          'user.editForm.LAST_NAME_INVALID'
        );
      }
    }

    return null;
  }

  protected get emailErrors(): string | null {
    const control = this.form.controls.email;
    if (control.errors) {
      if (control.errors['required']) {
        return this.translationService.translate(
          'user.editForm.EMAIL_REQUIRED'
        );
      }
      if (control.errors['email']) {
        return this.translationService.translate('user.editForm.EMAIL_INVALID');
      }
    }

    return null;
  }

  protected get passwordErrors(): string | null {
    const control = this.form.controls.passwords.get('password');
    if (control?.errors) {
      if (control.errors['invalidPassword']) {
        return this.translationService.translate(
          'user.editForm.PASSWORD_INVALID'
        );
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
