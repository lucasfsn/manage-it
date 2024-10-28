import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UpdateUser, User } from '../../../../core/models/user.model';
import { UserService } from '../../../../core/services/user.service';

function equalValues(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const value1 = control.get(controlName1)?.value;
    const value2 = control.get(controlName2)?.value;

    if (value1 === value2) {
      return null;
    }

    return { equalValues: true };
  };
}

function nameValidator(control: AbstractControl) {
  const nameRegex =
    /^(?=(?:[^A-Za-z]*[A-Za-z]){2})(?![^\d~`?!^*¨ˆ;@=$%{}\[\]|\\\/<>#“.,]*[\d~`?!^*¨ˆ;@=$%{}\[\]|\\\/<>#“.,])\S+(?: \S+){0,2}$/;

  if (nameRegex.test(control.value)) return null;

  return {
    invalidName: true,
  };
}

function passwordValidator(control: AbstractControl) {
  const passwordRegex =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  if (passwordRegex.test(control.value)) return null;

  return {
    invalidPassword: true,
  };
}

@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './edit-profile-form.component.html',
  styleUrl: './edit-profile-form.component.css',
})
export class EditProfileFormComponent {
  userData: User | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private dialogRef: MatDialogRef<EditProfileFormComponent>,
    private userService: UserService
  ) {
    this.userData = data?.user;
  }

  protected form = new FormGroup({
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
    userName: new FormControl('', {
      validators: [
        Validators.minLength(2),
        Validators.maxLength(20),
        nameValidator,
      ],
    }),
    email: new FormControl('', {
      validators: [Validators.email],
    }),
    passwords: new FormGroup(
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

  get userNameIsInvalid() {
    return (
      this.form.controls.userName.dirty &&
      this.form.controls.userName.touched &&
      this.form.controls.userName.invalid
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

  get userNameErrors() {
    const control = this.form.controls.userName;
    if (control.errors) {
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
    if (this.userData) {
      this.form.patchValue({
        firstName: this.userData.firstName,
        lastName: this.userData.lastName,
        userName: this.userData.userName,
        email: this.userData.email,
        passwords: {
          password: '',
          confirmPassword: '',
        },
      });
    }
  }

  onSubmit() {
    if (!this.userData) return;

    if (
      this.form.invalid &&
      !!this.form.controls.passwords.get('password')?.value &&
      !!this.form.controls.passwords.get('confirmPassword')?.value
    ) {
      return;
    }

    const updatedUserData: UpdateUser = {
      firstName: this.form.value.firstName
        ? this.form.value.firstName
        : this.userData.firstName,
      lastName: this.form.value.lastName
        ? this.form.value.lastName
        : this.userData.lastName,
      userName: this.form.value.userName
        ? this.form.value.userName
        : this.userData.userName,
      email: this.form.value.email
        ? this.form.value.email
        : this.userData.email,
    };

    if (this.form.value.passwords?.password) {
      updatedUserData.password = this.form.value.passwords.password;
    }

    this.userService.updateUserData(this.userData, updatedUserData).subscribe();
    this.closeDialog();
  }

  onReset() {
    this.fillFormWithDefaultValues();
  }

  ngOnInit(): void {
    this.fillFormWithDefaultValues();
  }
}
