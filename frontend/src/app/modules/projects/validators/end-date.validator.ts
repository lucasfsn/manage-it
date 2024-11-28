import { AbstractControl } from '@angular/forms';

export function endDateValidator(startDate: string, endDate: string) {
  return (control: AbstractControl) => {
    const startDateValue = control.get(startDate)?.value;
    const endDateValue = control.get(endDate)?.value;

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
