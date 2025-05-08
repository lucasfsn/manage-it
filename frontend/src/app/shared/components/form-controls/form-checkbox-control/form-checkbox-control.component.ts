import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-checkbox-control',
  imports: [CommonModule],
  templateUrl: './form-checkbox-control.component.html',
  styleUrl: './form-checkbox-control.component.scss',
})
export class FormCheckboxControlComponent {
  @Input({ required: true }) public identifier!: string;
  @Input({ required: true }) public label!: string;
}
