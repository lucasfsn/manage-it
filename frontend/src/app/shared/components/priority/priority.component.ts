import { Component, Input } from '@angular/core';
import { Priority } from '../../../features/dto/project.model';
import { MappersService } from '../../../features/services/mappers.service';

@Component({
  selector: 'app-priority',
  standalone: true,
  imports: [],
  templateUrl: './priority.component.html',
  styleUrl: './priority.component.scss',
})
export class PriorityComponent {
  @Input() public priority!: Priority;
  @Input() public textSize? = 'text-xs';

  public constructor(private mappersService: MappersService) {}

  protected get Priority(): typeof Priority {
    return Priority;
  }

  protected mapPriority(priority: Priority): string {
    return this.mappersService.priorityMapper(priority);
  }
}
