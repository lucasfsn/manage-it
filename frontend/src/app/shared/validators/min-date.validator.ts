import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minDate(minDate: string | null, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!minDate || !control.value) return null;

    const controlDate = new Date(control.value);
    const minimumDate = new Date(minDate);

    return controlDate < minimumDate ? { minDate: { message, minDate } } : null;
  };
}
