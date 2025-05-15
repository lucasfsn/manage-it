import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function equalValues<T>(
  otherControlName: string,
  message: string,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const otherControl = control.parent?.get(otherControlName);
    if (!otherControl) return null;

    const value1 = control.value as T | null;
    const value2 = otherControl.value as T | null;

    return value1 === value2 ? null : { equalValues: { message: message } };
  };
}
