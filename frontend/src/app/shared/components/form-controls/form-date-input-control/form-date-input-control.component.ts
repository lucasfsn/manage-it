import { FormControlDirective } from '@/app/shared/components/form-controls/form-control.directive';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-date-input-control',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-date-input-control.component.html',
  styleUrl: './form-date-input-control.component.scss',
})
export class FormDateInputControlComponent extends FormControlDirective {
  @Input() public min: string | null = null;
  @Input() public max: string | null = null;
  @Input() public placeholder: string = '';
}
