import { AbstractControl, ValidationErrors } from '@angular/forms';

export function endDateValidator(startDate: string, endDate: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDateControl = control.get(startDate);
    const endDateControl = control.get(endDate);

    if (!startDateControl || !endDateControl) {
      return null;
    }

    const startDateValue = startDateControl.value as string | null;
    const endDateValue = endDateControl.value as string | null;

    if (!startDateValue || !endDateValue) {
      return null;
    }

    if (new Date(startDateValue) <= new Date(endDateValue)) {
      return null;
    }

    return {
      invalidEndDate: true,
    };
  };
}
