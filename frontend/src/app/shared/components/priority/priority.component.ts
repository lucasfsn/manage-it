import { Component, Input } from '@angular/core';
import { Priority } from '../../../core/models/project.model';

@Component({
  selector: 'app-priority',
  standalone: true,
  imports: [],
  templateUrl: './priority.component.html',
  styleUrl: './priority.component.css',
})
export class PriorityComponent {
  @Input() priority!: Priority;
  readonly Priority = Priority;
}
