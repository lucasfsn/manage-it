import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requiredValidator(message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (
      control.value === null ||
      control.value === undefined ||
      control.value === ''
    )
      return { required: { message: message } };

    return null;
  };
}
