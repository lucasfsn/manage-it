import { Priority } from '@/app/features/dto/task.model';
import { MapperService } from '@/app/shared/services/mapper.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-priority',
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
