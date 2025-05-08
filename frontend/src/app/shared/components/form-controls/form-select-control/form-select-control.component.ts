import { FormControlDirective } from '@/app/shared/components/form-controls/form-control.directive';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-form-select-control',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-select-control.component.html',
  styleUrl: './form-select-control.component.scss',
})
export class FormSelectControlComponent extends FormControlDirective {
  @Input() public options: SelectOption[] = [];
  @Input() public customIsInvalid: boolean | null = null;

  protected override get isInvalid(): boolean {
    if (this.customIsInvalid !== null) return this.customIsInvalid;

    return super.isInvalid;
  }
}
