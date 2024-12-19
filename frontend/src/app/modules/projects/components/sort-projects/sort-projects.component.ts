import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MappersService } from '../../../../features/services/mappers.service';
import {
  ProjectsSort,
  SortCriteria,
  SortOrder,
} from '../../models/project-sort.model';

@Component({
  selector: 'app-sort-projects',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './sort-projects.component.html',
  styleUrl: './sort-projects.component.scss',
})
export class SortProjectsComponent {
  @Input() public sortCriteria: SortCriteria = SortCriteria.NAME;
  @Input() public sortOrder: SortOrder = SortOrder.ASCENDING;
  @Output() public sortChange = new EventEmitter<ProjectsSort>();

  public constructor(private mappersService: MappersService) {}

  protected onSortCriteriaChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortCriteria = selectElement.value as SortCriteria;
    this.emitSortChange();
  }

  protected onSortOrderChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOrder = selectElement.value as SortOrder;
    this.emitSortChange();
  }

  protected get sortCriterias(): SortCriteria[] {
    return Object.values(SortCriteria);
  }

  protected get sortOrders(): SortOrder[] {
    return Object.values(SortOrder);
  }

  protected mapOrder(order: SortOrder): string {
    return this.mappersService.sortOrderMapper(order);
  }

  protected mapCriteria(criteria: SortCriteria): string {
    return this.mappersService.sortCriteriaMapper(criteria);
  }

  private emitSortChange(): void {
    this.sortChange.emit({
      criteria: this.sortCriteria,
      order: this.sortOrder,
    });
  }
}
