import { Component, Input } from '@angular/core';
import { Priority } from '../../../features/dto/project.model';
import { MapperService } from '../../../features/services/mapper.service';

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

  public constructor(private mapperService: MapperService) {}

  protected get Priority(): typeof Priority {
    return Priority;
  }

  protected mapPriority(priority: Priority): string {
    return this.mapperService.priorityMapper(priority);
  }
}
