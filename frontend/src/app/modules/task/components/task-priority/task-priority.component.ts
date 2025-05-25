import { MapperService } from '@/app/core/services/mapper.service';
import { TaskPriority } from '@/app/modules/task/types/task-priority.type';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task-priority',
  imports: [],
  templateUrl: './task-priority.component.html',
  styleUrl: './task-priority.component.scss',
})
export class TaskPriorityComponent {
  @Input() public priority!: TaskPriority;
  @Input() public textSize? = 'text-xs';

  public constructor(private mapperService: MapperService) {}

  protected get TaskPriority(): typeof TaskPriority {
    return TaskPriority;
  }

  protected mapPriority(priority: TaskPriority): string {
    return this.mapperService.priorityMapper(priority);
  }
}
