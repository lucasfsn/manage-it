import { AbstractControl } from '@angular/forms';

export function dueDateValidator(
  control: AbstractControl
): Record<string, boolean> | null {
  const selectedDate = new Date(control.value);
  const today = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (selectedDate >= today) return null;

  return {
    invalidDate: true,
  };
}
