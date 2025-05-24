import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxDate(maxDate: string | null, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!maxDate || !control.value) return null;

    const controlDate = new Date(control.value);
    const maximumDate = new Date(maxDate);

    return controlDate > maximumDate ? { maxDate: { message, maxDate } } : null;
  };
}
