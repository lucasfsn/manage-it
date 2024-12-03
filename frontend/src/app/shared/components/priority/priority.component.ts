import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Priority } from '../../../features/dto/project.model';
import { priorityMapper } from '../../utils/priority-mapper';

@Component({
  selector: 'app-priority',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './priority.component.html',
  styleUrl: './priority.component.css',
})
export class PriorityComponent {
  @Input() priority!: Priority;
  @Input() textSize? = 'text-xs';

  get Priority(): typeof Priority {
    return Priority;
  }

  mapPriority(priority: Priority): string {
    return priorityMapper(priority);
  }
}
