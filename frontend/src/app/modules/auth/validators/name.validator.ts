import { AbstractControl, ValidationErrors } from '@angular/forms';

export function nameValidator(
  control: AbstractControl
): ValidationErrors | null {
  const nameRegex =
    /^[a-zA-Z\xC0-\uFFFF]+([ \-']{0,1}[a-zA-Z\xC0-\uFFFF]+){0,2}[.]{0,1}$/;

  return nameRegex.test(control.value) ? null : { invalidName: true };
}
