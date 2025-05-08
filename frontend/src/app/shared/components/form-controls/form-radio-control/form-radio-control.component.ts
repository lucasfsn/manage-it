import { FormControlDirective } from '@/app/shared/components/form-controls/form-control.directive';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

export interface RadioOption {
  label: string;
  value: string | null;
}

@Component({
  selector: 'app-form-radio-control',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-radio-control.component.html',
  styleUrl: './form-radio-control.component.scss',
})
export class FormRadioControlComponent extends FormControlDirective {
  @Input() public options: RadioOption[] = [];
  @Input() public customIsInvalid: boolean | null = null;

  protected override get isInvalid(): boolean {
    if (this.customIsInvalid !== null) return this.customIsInvalid;

    return super.isInvalid;
  }
}
