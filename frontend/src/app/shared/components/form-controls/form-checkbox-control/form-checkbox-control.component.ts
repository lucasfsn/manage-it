import { FormControlDirective } from '@/app/shared/components/form-controls/form-control.directive';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-checkbox-control',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-checkbox-control.component.html',
  styleUrl: './form-checkbox-control.component.scss',
})
export class FormCheckboxControlComponent extends FormControlDirective {
  @Input({ required: true }) public override label: string = '';
  @Input() public override control: FormControl = new FormControl();
}
